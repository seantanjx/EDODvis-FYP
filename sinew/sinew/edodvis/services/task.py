import logging
from collections import defaultdict
from datetime import datetime, timedelta
from django.db import transaction
import json
from ..utils import get_yesterday_date, time_zone, get_battery_level, hours_between_nonabsolute
from edodvis.models import Sensorreading, Device, Participant, Biomarker
from main.models import MainSensorreading, MainSysmonreading, MainDeployment
import django
django.setup()


logger = logging.getLogger(__name__)


test_datetime = time_zone.localize(datetime(2022, 1, 13, 0, 0, 0))
# test dates are used for testing biomarker migration (if migration runs on 13th Jan 2022, sensorreadings on 12th Jan should be used not 13th)
test_date = test_datetime.date()-timedelta(days=1)
localized_now = time_zone.localize(datetime.now())


def device_daily_migration(migrate_datetime=datetime.now(time_zone)):
    '''
    Migrates device data from SINEW to Edodvis
        - Last updated record
        - Battery level
        - Device status

    Returns True upon completion
    '''
    logger.info(f"Device Daily Migration Started.")

    devices = Device.objects.all()
    valid_devices = [device.device_id for device in devices if device.name[0] == "9"]
    device_count = len(valid_devices)
    dt = {device_id: None for device_id in valid_devices}

    end_date = migrate_datetime + timedelta(days=1)
    start_date = migrate_datetime - timedelta(days=1)

    sysmonreadings = MainSysmonreading.objects.all().filter(
        key="battery_percent", server_timestamp__range=(start_date, end_date)).order_by(
        'device_id', '-server_timestamp').distinct('device_id')

    sensorreadings = MainSensorreading.objects.all().filter(
        server_timestamp__range=(start_date, end_date)).order_by(
        'device_id', '-server_timestamp').distinct('device_id')

    sysmon_ignored = []
    for sysmon in sysmonreadings:
        try:
            battery_percentage = int(sysmon.value)
            last_updated_datetime = sysmon.server_timestamp
            if hours_between_nonabsolute(last_updated_datetime, migrate_datetime) < 8:
                dt[sysmon.device_id] = {'battery_level': get_battery_level(
                    battery_percentage), 'last_updated': last_updated_datetime, 'status': "online"}
            else:
                dt[sysmon.device_id] = {'battery_level': 'unknown',
                                        'last_updated': last_updated_datetime, 'status': "offline"}
        except KeyError:
            sysmon_ignored.append(sysmon.device_id)
    sensor_ignored = []
    for sensor in sensorreadings:
        last_updated_datetime = sensor.server_timestamp
        try:
            if dt[sensor.device_id] == None:
                dt[sensor.device_id] = {'battery_level': None, 'last_updated': last_updated_datetime, 'status': None}
            else:
                if last_updated_datetime < dt[sensor.device_id]['last_updated']:
                    dt[sensor.device_id]['last_updated'] = last_updated_datetime
            if hours_between_nonabsolute(last_updated_datetime, migrate_datetime) < 8:
                dt[sensor.device_id]['status'] = "online"
            else:
                dt[sensor.device_id]['status'] = "offline"
        except KeyError:
            sysmon_ignored.append(sensor.device_id)

    warnings = []
    with transaction.atomic():
        for key, value in dt.items():
            if value == None:
                warnings.append(key)
                Device.objects.filter(device_id=key).update(status='offline')
            else:
                Device.objects.filter(
                    device_id=key).update(
                    battery_level=value['battery_level'],
                    last_updated=value['last_updated'],
                    status=value['status'])
    logger.warn(f"A total of {len(warnings)}, {round(len(warnings)/(device_count)*100,2)}% of devices had no readings in main_sysmonreading and main_sensorreading. Device IDs are: {warnings}")
    logger.warn(
        f"Devices {sysmon_ignored} were ignored from sysmon reading & Devices {sensor_ignored} were ignored from sensor reading")
    logger.info(f"Device Daily Migration Finished.")
    return True


def medication_daily_migration(yesterday=get_yesterday_date()):

    logger.info(f'Started forgotten_medication_daily_migration.')

    try:
        bio_forgotten_medication = Biomarker.objects.get(pk="forgotten_medication")
        bio_frequency_open_medbox = Biomarker.objects.get(pk="frequency_open_medbox")

        bulk_create_objs = []

        medbox_devices = Device.objects.select_related('participant').filter(location='medbox')

        for device in medbox_devices:

            hours_tracked = []
            forgotten_medication_count = device.participant.medication_required
            frequency_open_medbox = 0

            if device.status == 'offline' or device.status == None:
                # For normal daily migration if device is offline no need to check readings
                continue
            else:   # device is online, so there should be readings with in last 8 hours
                try:
                    readings = MainSensorreading.objects.filter(
                        value='255', device_id=device.device_id, server_timestamp__date=yesterday)
                except AttributeError:
                    logger.info(f"No readings for medbox_device {device.device_id} on {yesterday}")
                    bulk_create_objs.append([device.participant, yesterday,
                                            bio_forgotten_medication, device, forgotten_medication_count])
                    bulk_create_objs.append([device.participant, yesterday,
                                            bio_frequency_open_medbox, device, frequency_open_medbox])
                    continue

                for reading in readings:

                    reading_data = reading.__dict__
                    server_timestamp = reading_data['server_timestamp']
                    hour = server_timestamp.hour

                    frequency_open_medbox += 1  # each reading with value 255 counts as medbox being opened once

                    if len(hours_tracked) == 0:
                        hours_tracked.append(hour)
                        forgotten_medication_count -= 1
                    else:
                        for old_hour in hours_tracked:
                            if abs(
                                    hour - old_hour) >= 3:  # if any of the hours already tracked is greater than equal to 3 hours from new reading
                                hours_tracked.append(hour)
                                forgotten_medication_count -= 1
                            else:
                                break   # no need to check the other hours tracked if any of the previously tracked hour is less than 3 hours

                bulk_create_objs.append([device.participant, yesterday, bio_forgotten_medication,
                                        device, forgotten_medication_count])
                bulk_create_objs.append([device.participant, yesterday,
                                        bio_frequency_open_medbox, device, frequency_open_medbox])

        # Execute the saving query on all the bulk_create_objects into the database
        with transaction.atomic():
            for bio_reading in bulk_create_objs:
                participant = bio_reading[0]
                Sensorreading.objects.create(
                    participant=participant, date=bio_reading[1],
                    biomarker=bio_reading[2],
                    device=bio_reading[3],
                    value=bio_reading[4])

    except Exception as e:
        logger.warning(f'Migration for Medication Devices Failed for Date: {yesterday} with error {e}')
        return False

    logger.info(f'Migration for Medication Devices Successful for Date: {yesterday}.')

    return True


def miband_daily_migration(yesterday=get_yesterday_date()):

    try:
        logger.info(f'Started miband_daily_migration for {yesterday}.')
        bio_heart_rate = Biomarker.objects.get(pk="heart_rate")
        bio_steps = Biomarker.objects.get(pk="steps")
        miband_device = Device.objects.filter(type="miband")

        bulk_create_objs = []

        for device in miband_device:
            avg_heart_rate = 0
            max_steps = 0
            readings = MainSensorreading.objects.filter(
                device_id=device.device_id, server_timestamp__date=yesterday)

            if not readings.exists():
                continue

            else:
                participant = Participant.objects.get(pk=device.participant_id)

                device_data = defaultdict(list)

                for reading in readings:

                    server_timestamp = reading.server_timestamp.date()
                    value = json.loads(reading.value.replace("\'", "\""))

                    device_data["hr"].append(value["hr"])
                    device_data["s"].append(value["s"])

                try:
                    if len(device_data["hr"]) > 0:
                        avg_heart_rate = int(sum(device_data["hr"])/len(device_data["hr"]))
                        if avg_heart_rate > 30:
                            bulk_create_objs.append([participant, server_timestamp,
                                                    bio_heart_rate, device, avg_heart_rate])
                except Exception as e:
                    logger.info(f'miband {device.device_id} failed to migrate average heart rate with error {e}')

                try:
                    if len(device_data["s"]) > 0:
                        max_steps = int(max(device_data["s"]))
                        if max_steps > 0:
                            bulk_create_objs.append([participant, server_timestamp, bio_steps, device, max_steps])
                except Exception as e:
                    logger.info(f'miband {device.device_id} failed to migrate max step count with error {e}')

            '''
            Structure of device_data
            {
                's':[5,10,15,20],
                'hr': [10,20,30,40]
            }
            '''
    except Exception as e:
        logger.warning(f'Migration for Miband Failed for Date: {yesterday} with error {e}')
        return False

    with transaction.atomic():
        for bio_reading in bulk_create_objs:
            participant = bio_reading[0]
            Sensorreading.objects.create(
                participant=participant, date=bio_reading[1],
                biomarker=bio_reading[2],
                device=bio_reading[3],
                value=bio_reading[4])

    logger.info(f'Migration for Miband Data Successful for Date: {yesterday}')
    return True


def beacon_daily_migration(date=get_yesterday_date()):

    try:
        participants = Participant.objects.all()
        bio_forgotten_keys = Biomarker.objects.get(pk="forgotten_keys")
        bio_forgotten_wallet = Biomarker.objects.get(pk="forgotten_wallet")
        bio_outings = Biomarker.objects.get(pk="outings")
        bio_time_away_from_home = Biomarker.objects.get(pk="away_from_home_duration")
    except Participant.DoesNotExist:
        logger.info('No Participants found while trying to migrate daily beacon related biomarkers')

    participants_with_errors = {'door': [], 'motion': [], 'key or wallet': []}

    bulk_create_objs = []

    for participant in participants:
        try:
            main_door = Device.objects.filter(participant_id=participant.participant_id, location="main_door")[0]
            main_door_id = main_door.device_id
            main_door_readings = MainSensorreading.objects.filter(device_id=main_door_id, server_timestamp__date=date)
            if not main_door_readings.exists():
                continue
        except:
            participants_with_errors['door'].append(participant.participant_id)
            continue

        try:
            motion_devices = Device.objects.filter(participant_id=participant.participant_id, location="living_room")
            motion_device_id = motion_devices[0].device_id
        except:
            # logger.info(f"{participant.participant_id}: No motion devices")
            participants_with_errors['motion'].append(participant.participant_id)
            continue

        try:
            participant_key = Device.objects.filter(participant_id=participant.participant_id, location="key")[0]
            participant_key_id = participant_key.device_id
            participant_wallet = Device.objects.filter(participant=participant.participant_id, location="wallet")[0]
            participant_wallet_id = participant_wallet.device_id
        except:
            # logger.info(f"{participant.participant_id}: No key or wallet found")
            participants_with_errors['key or wallet'].append(participant.participant_id)
            continue

        threshold = main_door_readings[0].server_timestamp - timedelta(minutes=1)
        door_open = []
        for reading in main_door_readings:
            reading_timestamp = reading.server_timestamp.astimezone(time_zone)
            if reading_timestamp > threshold:
                door_open.append(reading_timestamp)
                threshold = reading_timestamp + timedelta(minutes=15)

        all_devices = [main_door_id, motion_device_id, participant_key_id, participant_wallet_id]
        filtered_data = MainSensorreading.objects.filter(
            device_id__in=all_devices, server_timestamp__range=[door_open[0], door_open[-1]])

        total_readings = len(door_open)
        current_index = 0
        forgotten_key_count = 0
        forgotten_wallet_count = 0
        outings = 0
        time_away_from_home = 0
        while current_index < total_readings:
            try:
                start = door_open[current_index]
                end = door_open[current_index + 1]

                data = filtered_data.filter(
                    device_id__in=[motion_device_id, participant_key_id, participant_wallet_id],
                    server_timestamp__range=[start, end])

                if data.filter(device_id=motion_device_id, value="255").exists():
                    '''check if participant was out overnight, however data doesn't make cause participant might be asleep '''

                    current_index += 1
                    continue
                else:
                    outings += 1

                    time_away_from_home += ((end - start).total_seconds()) / 60

                    if data.filter(device_id=participant_key_id).exists():
                        forgotten_key_count += 1

                    if data.filter(device_id=participant_wallet_id).exists():
                        forgotten_wallet_count += 1

                    current_index += 2
            except:
                '''
                if participant leaves house before midnight add duration: 12 midnight - when left house
                however data doesn't make sense
                and can't check for motion, cause participant might be asleep
                '''
                current_index += 1

        bulk_create_objs.append([participant, date, bio_forgotten_keys, participant_key, forgotten_key_count])
        bulk_create_objs.append([participant, date, bio_forgotten_wallet, participant_wallet, forgotten_wallet_count])
        bulk_create_objs.append([participant, date, bio_outings, main_door, outings])
        bulk_create_objs.append([participant, date, bio_time_away_from_home, main_door, time_away_from_home])

    # Execute the saving query on all the bulk_create_objects into the database
    with transaction.atomic():
        for bio_reading in bulk_create_objs:
            participant = bio_reading[0]
            Sensorreading.objects.create(
                participant=participant, date=bio_reading[1],
                biomarker=bio_reading[2],
                device=bio_reading[3],
                value=bio_reading[4])

    if len(participants_with_errors['door']) > 0:
        logger.info(f"Participants without door sensors {participants_with_errors['door']}")
    if len(participants_with_errors['motion']) > 0:
        logger.info(f"Participants without motion sensors {participants_with_errors['motion']}")
    if len(participants_with_errors['key or wallet']) > 0:
        logger.info(f"Participants without key or wallet {participants_with_errors['key or wallet']} ")
    return True


def sleep_duration_daily_migration(date=get_yesterday_date()):
    try:
        participants = Participant.objects.all()
        bio_sleep_duration = Biomarker.objects.get(pk="sleep_duration")
    except Participant.DoesNotExist:
        logger.info(f'sleep_duration_daily_migration faced error parcipant does not exist')

    bed_errors = []
    bulk_create_objs = []
    for participant in participants:
        try:
            bed = Device.objects.filter(participant=participant.participant_id, location="bed")[0]
            bed_id = bed.device_id
        except:
            bed_errors.append(participant.participant_id)
            continue

        readings = MainSensorreading.objects.filter(device_id=bed_id, server_timestamp__date=date)

        if len(readings) == 0:
            continue
        else:
            sleep_duration = 0
            value_equals_255 = False

            for index, reading in enumerate(readings):
                value = reading.value
                reading = reading.server_timestamp.astimezone(time_zone)

                if index == 0 and value == '0':
                    end = reading
                    midnight = datetime.combine(date, datetime.min.time()).astimezone(time_zone)

                    if end - midnight > timedelta(minutes=15):
                        sleep_duration += ((end - midnight).total_seconds()) / 60
                    else:
                        previous_day_readings = MainSensorreading.objects.filter(
                            device_id=bed_id, value='255', server_timestamp__date=date)
                        start = previous_day_readings.reverse()[0].server_timestamp.astimezone(time_zone)
                        sleep_duration += ((end - start).total_seconds()) / 60

                if index == len(readings) - 1 and value == '255':
                    midnight = datetime.combine(date, datetime.max.time()).astimezone(time_zone)
                    sleep_duration += (midnight - reading).total_seconds() / 60
                    break

                if value_equals_255 == False and value == '255':
                    start = reading
                    value_equals_255 = True
                    continue

                if value_equals_255 == True and value == '0':
                    end = reading
                    if end - start > timedelta(minutes=15):
                        sleep_duration += ((end - start).total_seconds()) / 60
                    value_equals_255 = False
            bulk_create_objs.append([participant, date, bio_sleep_duration, bed, round(sleep_duration)])

    # Execute the saving query on all the bulk_create_objects into the database
    with transaction.atomic():
        for bio_reading in bulk_create_objs:
            participant = bio_reading[0]
            Sensorreading.objects.create(
                participant=participant, date=bio_reading[1],
                biomarker=bio_reading[2],
                device=bio_reading[3],
                value=bio_reading[4])

    logger.info(f"Participants without bed sensors installed {bed_errors}")
    return True


def set_last_serviced():
    participants = MainDeployment.objects.all()
    for participant in participants:
        try:
            build_dt = [participant.install_date.year, participant.install_date.month, participant.install_date.day]
            Device.objects.filter(participant_id=participant.participant_id).update(
                last_serviced=time_zone.localize(datetime(build_dt[0], build_dt[1], build_dt[2])))
        except AttributeError:
            logger.warning(
                f'{participant.participant_id} does not have an install date, start of sinew set as last_serviced by default.')
            build_dt = [2020, 11, 6]
            Device.objects.filter(participant_id=participant.participant_id).update(
                last_serviced=time_zone.localize(datetime(build_dt[0], build_dt[1], build_dt[2])))
    return True
