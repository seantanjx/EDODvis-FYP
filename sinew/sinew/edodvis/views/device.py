from ..services.authentication import UserAuthentication
from ..services.permissions import SuperUserPermissions, DataEngineerPermissions
from ..models import Device, Participant
from ..serializers import DeviceOverviewSerializer

from rest_framework import status as httpStatus
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from django.db.models import Count
from django.db.models import Q
from ..utils import get_days_from_date_before

import datetime
import json
from pytz import timezone

import logging
logger = logging.getLogger(__name__)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_all_devices(request):
    try:
        devices = Device.objects.all().order_by("participant_id")
    except Device.DoesNotExist:
        return Response("No devices found", status=httpStatus.HTTP_404_NOT_FOUND)
    serializer = DeviceOverviewSerializer(devices, context={'request': request}, many=True)
    if serializer.is_valid:
        return Response(serializer.data, status=httpStatus.HTTP_200_OK)
    else:
        return Response(status=httpStatus.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([UserAuthentication])
def get_devices_by_participant_id(request, participant_id):
    try:
        devices = Device.objects.filter(participant=participant_id)
    except Device.DoesNotExist:
        return Response("No devices found", status=httpStatus.HTTP_404_NOT_FOUND)

    nice_long_dic = {}

    for device in devices:
        if (not device.last_updated) and device.status == 'online':
            days_down = 0
        elif (not device.last_updated) and device.status == 'offline':
            days_down = 1
        else:
            days_down = get_days_from_date_before(device.last_updated)
        if not device.last_serviced:
            last_serviced = None
        else:
            last_serviced = str(device.last_serviced.date())
        try:
            nice_long_dic[device.device_id] = {
                'device_name': device.name,
                'battery_level': device.battery_level,
                'status': device.status,
                'last_updated': str(device.last_updated),
                'last_serviced': last_serviced,
                'type': device.type,
                'location': device.location,
                'remarks': device.remarks,
                'participant': participant_id,
                'days_down': days_down
            }
        except Exception as e:
            return Response(f'Error with device {e}', status=httpStatus.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(json.dumps(nice_long_dic), status=httpStatus.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_devices_overview_data(request):
    """

    Returns a dictionary of all components in the overview page (except alert table)
    For a specific area, unless "all" is requested.

    Example return:
    {
        "lost_signal" : {"beacons":6,"bed":6, "door":6, "miband":3, "motion": 0},
        "low_battery" : {"bed":0, "door":6, "motion": 10}, --beacons and miband doesn't have battery readings
        "sensor_health" : {"high": 36, "medium": 0, "low" 16},
        "sumary_of_sensors" : {"total_houses_deployed": 59, "total_houses_w_low_battery": 10,
                                "participant_id_w_low_battery" : [9001, 9002], "total_houses_w_offline": 3, "participant_id_w_offline" : [9003, 9005]}
    }

    """
    try:
        postal_district = request.data["postalDistrict"]
    except:
        return Response("No postal district found", status=httpStatus.HTTP_400_BAD_REQUEST)

    try:
        participants = Participant.objects.all()
        if postal_district != 'all':
            try:
                participants = [participant for participant in participants
                                if participant.postal_district == int(postal_district)]
            except:
                return Response("Invalid postal district", status=httpStatus.HTTP_400_BAD_REQUEST)

        if len(participants) == 0:
            raise ValueError("No participants found in the area!")

        participant_ids = [participant.participant_id for participant in participants]

        lost_signal = get_lost_signal_counts(participant_ids)
        low_battery = get_low_battery_counts(participant_ids)
        sensor_health = get_battery_level_counts(participant_ids)
        summary_of_sensors = get_houses_data(participant_ids)
    except Exception as e:
        error_message = f"No devices found in that area"
        return Response(error_message, status=httpStatus.HTTP_404_NOT_FOUND)
    resp = {"lost_signal": lost_signal, "low_battery": low_battery,
            "sensor_health": sensor_health, "summary_of_sensors": summary_of_sensors}
    return Response(json.dumps(resp), status=httpStatus.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_houses_data_by_area(request):
    '''
    Returns 5 data points:
    {total_houses_deployed,
    total_houses_w_low_battery,
    participant_id_w_low_battery,
    total_houses_w_offline
    participant_id_w_offline}
    '''
    counts_by_area = {
        'total_houses_deployed': 0,
        'total_houses_w_low_battery': 0,
        'participant_id_w_low_battery': [],
        'total_houses_w_offline': 0,
        'participant_id_w_offline': []
    }

    # Count of participants is total houses deployed
    try:
        postal_district = request.data["postalDistrict"]
        participants = Participant.objects.all()
        if postal_district != 'all':
            participants = [participant for participant in participants
                            if participant.postal_district == int(postal_district)]
        total_houses_deployed = len(participants)
        counts_by_area['total_houses_deployed'] = total_houses_deployed
    except Participant.DoesNotExist:
        return Response("No participants found", status=httpStatus.HTTP_404_NOT_FOUND)

    for participant in participants:

        # Get count of low battery devices, as long as 1 device is offline for a participant, count goes up by one
        try:
            single_house_count_low_battery = Device.objects.filter(
                participant=participant.participant_id, battery_level="low").count()
            if single_house_count_low_battery > 0:
                counts_by_area['total_houses_w_low_battery'] += 1
                counts_by_area['participant_id_w_low_battery'].append(participant.participant_id)
        except Device.DoesNotExist:
            pass

        # Get count of offline devices, as long as 1 device is offline for a participant, count goes up by one
        try:
            single_house_count_offline = Device.objects.filter(
                participant=participant.participant_id, status="offline").count()
            if single_house_count_offline > 0:
                counts_by_area['total_houses_w_offline'] += 1
                counts_by_area['participant_id_w_offline'].append(participant.participant_id)
        except Device.DoesNotExist:
            pass

    counts_by_area['participant_id_w_low_battery'].sort()
    counts_by_area['participant_id_w_offline'].sort()
    return Response(json.dumps(counts_by_area), status=httpStatus.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_alert_table_data_by_area(request):
    '''
    Retrieve data for alert table presented in this format
    {
    9001: {
        '9001-ac:893:3': {
        'days_down': 3,
        'remarks': '',
        'type' : "motion",
        'location': 'main door',
        'last_serviced': 'datetime.datetime',
        'battery_level': "low",
        'status': "online"
        }
    }
    }
    '''
    try:
        postal_district = request.data["postalDistrict"]
        participants = Participant.objects.all()
        if postal_district != 'all':
            participants = [participant for participant in participants
                            if participant.postal_district == int(postal_district)]
    except Participant.DoesNotExist:
        return Response("No participants found", status=httpStatus.HTTP_404_NOT_FOUND)

    nice_long_dic = {}

    for participant in participants:
        nice_long_dic[participant.participant_id] = {}
        try:
            devices = Device.objects.filter(
                participant=participant.participant_id).filter(
                Q(battery_level='low') | Q(status='offline'))
        except Device.DoesNotExist:
            return Response("No devices found", status=httpStatus.HTTP_404_NOT_FOUND)
        for device in devices:
            if (not device.last_updated) and device.status == 'online':
                days_down = 0
            elif (not device.last_updated) and device.status == 'offline':
                days_down = 1
            else:
                days_down = get_days_from_date_before(device.last_updated)

            try:
                nice_long_dic[participant.participant_id][device.name] = {
                    'days_down': days_down,
                    'remarks': device.remarks,
                    'type': device.type,
                    'location': device.location,
                    'last_serviced': str(device.last_serviced.date()),
                    'battery_level': device.battery_level,
                    'status': device.status
                }
            except Exception as e:
                logger.warning(f'Device: {device.name} had and error {e}')

        try:
            motion_device_ids = [x.device_id
                                 for x in Device.objects.filter(
                                     participant=participant.participant_id, type="motion")]

            if Device.objects.filter(device_id__in=motion_device_ids, status="online").exists():
                nice_long_dic[participant.participant_id]['participant_ok'] = True
            else:
                nice_long_dic[participant.participant_id]['participant_ok'] = False
        except Exception as e:
            logger.warning(f'Participant: {participant.participant_id} had an error {e}')

    return Response(
        json.dumps(sorted(nice_long_dic.items(),
                          key=lambda x: (x[1]['participant_ok'], x[0], x[1]))),
        status=httpStatus.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_all_devices_and_days_down(request):
    try:
        devices = Device.objects.all().order_by("participant_id")
        all_devices_data = []
        for device in devices:
            if (not device.last_updated) and device.status == 'online':
                days_down = 0
            elif (not device.last_updated) and device.status == 'offline':
                days_down = 1
            else:
                days_down = get_days_from_date_before(device.last_updated)
            data = {
                'device_id': device.device_id,
                'name': device.name,
                'battery_level': device.battery_level,
                'status': device.status,
                'last_serviced': str(device.last_serviced.date()),
                'type': device.type,
                'location': device.location,
                'participant': device.participant_id,
                'remarks': device.remarks,
                'days_down': days_down
            }
            all_devices_data.append(data)
    except Device.DoesNotExist:
        return Response("No devices found", status=httpStatus.HTTP_404_NOT_FOUND)

    all_devices_data = sorted(all_devices_data, key=lambda x: (x['participant'], x['device_id']))
    return Response(json.dumps(all_devices_data), status=httpStatus.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def update_last_service(request):
    try:
        device_ids = request.data['device_ids']
        datetime_object = datetime.datetime.now()
        Device.objects.filter(device_id__in=device_ids).update(last_serviced=datetime_object)
        return Response("Last service dates updated!", status=httpStatus.HTTP_200_OK)
    except Exception as e:
        return Response(f"Invalid request body", status=httpStatus.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def update_remarks(request):
    try:
        device_ids = request.data['device_ids']
        remarks = request.data['remarks']
        Device.objects.filter(device_id__in=device_ids).update(remarks=remarks)
        return Response("Remark updated!", status=httpStatus.HTTP_200_OK)

    except Exception as e:
        return Response(f"Invalid request body", status=httpStatus.HTTP_400_BAD_REQUEST)


def get_lost_signal_counts(participant_ids):
    """
    Get the count of devices that are offline grouped by their types, in a specific area or all areas.
    Returns a dictionary of the counts of each type of devices that are offlines in the area.

    Example return:
    {"beacon": 9, "door": 0, "motion": 1, "gateway": 3, "miband": 4, "bed": 6}

    """
    devices = Device.objects.filter(participant_id__in=participant_ids, status="offline")
    devices_count = {
        "beacon": devices.filter(type="beacon").count(),
        "door": devices.filter(type="door").count(),
        "motion": devices.filter(type="motion").count(),
        "gateway": devices.filter(type="gateway").count(),
        "miband": devices.filter(type="miband").count(),
        "bed": devices.filter(type="bed").count()
    }
    return devices_count


def get_low_battery_counts(participant_ids):
    """
    Get the count of devices that has low battery levels grouped by their types, in a specific postal district or all areas.
    Returns a dictionary of the counts of each type of devices that are offlines in the area.

    Example return:
    {"bed": 6 "door": 0, "motion": 1}

    """
    devices = Device.objects.filter(participant_id__in=participant_ids, battery_level="low")
    devices_count = {
        "bed": devices.filter(type="bed").count(),
        "door": devices.filter(type="door").count(),
        "motion": devices.filter(type="motion").count()
    }
    return devices_count


def get_battery_level_counts(participant_ids):
    """
    Get the count of devices grouped by their battery levels, in a specific postal district or all areas.

    Example return:
    {"low": 6 "medium": 0, "high": 1}

    """
    devices = Device.objects.filter(participant_id__in=participant_ids)
    battery_level_count_dic = {
        'low': devices.filter(participant_id__in=participant_ids, battery_level="low").count(),
        'medium': devices.filter(participant_id__in=participant_ids, battery_level="medium").count(),
        'high': devices.filter(participant_id__in=participant_ids, battery_level="high").count()
    }
    return battery_level_count_dic


def get_houses_data(participant_ids):
    """
    Get the 5 data ppints for summary of sensors by houses

    Example return:
    {'total_houses_deployed': 9,
    'total_houses_w_low_battery': 6,
    'participant_id_w_low_battery': [9001,9002],
    'total_houses_w_no_motion': 1,
    'participant_id_w_no_motion': [9005],
    'total_houses_w_offline': 3,
    'participant_id_w_offline': [9001,9002]}


    'total_houses_w_offline - total_houses_with_no_motion'
    """
    houses_data = {
        'total_houses_deployed': 0,
        'total_houses_w_low_battery': 0,
        'participant_id_w_low_battery': [],
        'total_houses_w_no_motion': 0,
        'participant_id_w_no_motion': [],
        'total_houses_w_offline': 0,
        'participant_id_w_offline': []
    }
    # Count of participants is total houses deployed
    total_houses_deployed = len(participant_ids)
    houses_data['total_houses_deployed'] = total_houses_deployed

    for pid in participant_ids:
        # Get count of low battery devices, as long as 1 device is offline for a participant, count goes up by one
        single_house_count_low_battery = Device.objects.filter(
            participant=pid, battery_level="low").count()
        if single_house_count_low_battery > 0:
            houses_data['total_houses_w_low_battery'] += 1
            houses_data['participant_id_w_low_battery'].append(pid)

        # Get count of offline devices, as long as 1 device is offline for a participant, count goes up by one
        single_house_count_offline = Device.objects.filter(
            participant=pid, status="offline").count()
        if single_house_count_offline > 0:
            houses_data['total_houses_w_offline'] += 1
            houses_data['participant_id_w_offline'].append(pid)
            if Device.objects.filter(
                    participant=pid, type="motion", status="online").count() == 0:
                houses_data['participant_id_w_no_motion'].append(pid)
                houses_data['total_houses_w_no_motion'] += 1
                houses_data['participant_id_w_offline'].remove(pid)

    houses_data['total_houses_w_offline'] -= houses_data['total_houses_w_no_motion']

    houses_data['participant_id_w_low_battery'].sort()
    houses_data['participant_id_w_offline'].sort()
    houses_data['participant_id_w_no_motion'].sort()

    return houses_data
