import django
django.setup()
import logging
from ..models import Device, Participant
from main.models import MainDeployment, MainDevice
from datetime import datetime, timedelta
from ..utils import postal_district_mapping, area_mapping, get_current_datetime, time_zone
from . import task
import concurrent.futures
import sys

logger = logging.getLogger(__name__)

test_datetime = time_zone.localize(datetime(2022, 1, 13, 0, 0, 0))
test_date = test_datetime.date()
localized_now = time_zone.localize(datetime.now())

def initial_migration(init_datetime=datetime.now(time_zone)):
    '''
    To be ran once, when initiating the database
    participant_data_creation: stores into edodvis.participants --> participant_id, postal_district, postal_code, area, age, risk_profile, gender, medication_required
    device_daily_migration : sets the --> battery_level of all devices that provides a battery reading, updates the --> last_updatedtime of any that has a sensorreading --> status offine/online depending on whether that was a sensorreading within 8hours
    miband_daily_migration : stores into edodvis.sensorreading footsteps and heart rate biomarker data
    forgotten_medication_daily_migration: stores into edodvis.sensorreading --> forgotten medication biomarker data
    frequency_open_medbox_daily_migration: stores into edodvis.sensorreading the --> frequency ofopen medbox biomarker data
    beacon_daily_migration: stores into edodvis.sensorreading the --> forgotten wallet biomarker data, forgotten keys biomarker data, outings biomarker data
    sleep_duration_daily_migration: stores into edodvis.sensorreading the --> sleep duration biomarker data
    '''
    #
    participant_data_creation()
    # Create Device Data in edodvis_device
    if device_initial_migration():
        logger.info(f'Device data creation done!')
        print(f'Device data creation done!')
    else:
        logger.warning(f'Device data creation FAILED!')
        return False
    
    # Set all last_serviced_datetime
    task.set_last_serviced()

    edate = init_datetime
    sdate = time_zone.localize(datetime(2020, 11, 7, 0, 0, 0))
    date_range = [sdate+timedelta(days=x) for x in range((edate-sdate).days)]
    
    print(f'Starting Biomarkers Daily Migration @ {get_current_datetime()}')
    
    total = len(date_range)
    count = 1
    for migration_datetime in date_range:
        progress_bar(count, total, status=f'Migrating Biomarkers for {migration_datetime}', bar_len=60)
        try:
            if daily_migration(migration_datetime):
                logger.info(f'Daily Migration for {migration_datetime} succeeded @ {get_current_datetime()}')
                count += 1
        except Exception as e:
            logger.warning(f"Daily Migration Failed for {migration_datetime}")
            
    print("Performing final migration for last day!")
    daily_migration(test_datetime)
    print(f'Biomarker Daily Migration for {len(date_range)} days succeeded @ {get_current_datetime()}')

    return True


def daily_migration(migration_datetime=get_current_datetime()):
    '''
    To be ran daily for migration of all required items,
    device_daily_migration : sets the --> battery_level of all devices that provides a battery reading, updates the --> last_updatedtime of any that has a sensorreading --> status offine/online depending on whether that was a sensorreading within 8hours
    miband_daily_migration : stores into edodvis.sensorreading footsteps and heart rate biomarker data
    forgotten_medication_daily_migration: stores into edodvis.sensorreading --> forgotten medication biomarker data
    frequency_open_medbox_daily_migration: stores into edodvis.sensorreading the --> frequency ofopen medbox biomarker data
    beacon_daily_migration: stores into edodvis.sensorreading the --> forgotten wallet biomarker data, forgotten keys biomarker data, outings biomarker data
    sleep_duration_daily_migration: stores into edodvis.sensorreading the --> sleep duration biomarker data
    '''
    day_before = migration_datetime.date() - timedelta(days=1)
    # Ensure all participants have devices under
    device_initial_migration()
    try:
        task.device_daily_migration(migration_datetime)
    except Exception as e:
        logger.warning(f'Daily device migration FAILED! For date {day_before}, With error: {e}')
        return False
    try:
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(task.miband_daily_migration, day_before)
            executor.submit(task.medication_daily_migration, day_before)
            executor.submit(task.beacon_daily_migration, day_before)
            executor.submit(task.sleep_duration_daily_migration, day_before)
    except Exception as e:
        logger.warning(f'Daily Biomarker migration FAILED! For date {day_before}, With error: {e}')
        return False
    return True


def participant_data_creation():
    '''
    Retrieve participant id from main deployment and map the participant id to a ???csv file???
    which contains the corresponding relevant postal code, risk_profile, gender, age, medication_required values

    '''
    # Take only participants that have devices that are deployed

    participants = MainDeployment.objects.all().filter(uninstall_date = None)
    valid_ids = []
    for participant in participants:
        if participant.install_date:
            valid_ids.append(participant.participant_id)
    
    for id in valid_ids:
        postal_code = '012345'  # TODO: retrieve postal code from csv or sth idk
        postal_district = postal_district_mapping[postal_code[:2]]
        area = area_mapping[postal_district]
        risk_profile = ''  # TODO: retrieve risk profile from csv  or sth idk
        gender = ''  # TODO: retrieve gender from csv  or sth idk
        age = ''  # TODO: retrieve age from csv  or sth idk
        medication_required = ''  # TODO: retrieve medication_required from csv  or sth idk
        Participant(int(id), postal_code, postal_district,
                    area, age, risk_profile, gender, medication_required).save()
        logger.info(f'Participant {id} successfully created.')
    return True


def device_initial_migration():
    valid_participants = Participant.objects.all()
    for participant in valid_participants:
        participant_id = participant.participant_id
        valid_devices = MainDevice.objects.filter(is_active = True, name__startswith=participant_id)
        for device in valid_devices:
            deviceid = device.id
            level = None
            device_status = "offline"
            last_updated_datetime = None
            device_type = device.type
            location = device.location
            Device.objects.update_or_create(device_id=deviceid,
                defaults={
                    "participant": participant,
                    "name": device.name,
                    "battery_level": level,
                    "status": device_status,
                    "last_updated": last_updated_datetime,
                    "type": device_type,
                    "location": location,
                },
            )
    return True
            

def progress_bar(count, total, status='', bar_len=60):
    filled_len = int(round(bar_len * count / float(total)))

    percents = round(100.0 * count / float(total), 1)
    bar = '=' * filled_len + '-' * (bar_len - filled_len)

    fmt = '[%s] %s%s ...%s' % (bar, percents, '%', status)
    print('\b' * len(fmt), end='')  # clears the line
    sys.stdout.write(fmt)
    sys.stdout.flush()

################################# TO BE REPLACED WITH particpant_data_creation ##############################################

def participant_data_creation_simulation():
    import random
    participants = MainDeployment.objects.all().filter(uninstall_date = None)
    valid_ids = []
    for participant in participants:
        if participant.install_date:
            valid_ids.append(participant.participant_id)
    for id in valid_ids:
        district = str(random.randint(1, 70))

        if len(district) == 1:
            district = "0" + district

        postal_district = postal_district_mapping[district]
        postal_code = district + str(random.randint(1000, 9999))
        area = area_mapping[postal_district]
        age = random.randint(50, 90)
        risk_profile = random.choice(['low', 'med', 'high'])
        gender = random.choice(['M', 'F'])
        medication_required = 3

        Participant(int(id), postal_code, postal_district,
                    area, age, risk_profile, gender, medication_required).save()

    return True

