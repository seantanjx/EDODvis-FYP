from tracemalloc import start
from main.models import MainSensorreading
from ..models import Sensorreading, Device, Participant, Biomarker
from ..serializers import SensorreadingSerializer
from ..utils import biomarker_mapping, fill_missing_dates, is_valid_start_end_date, periodicity_mapping, date_string_to_date, get_periodicity_method, biomarker_mapping
from ..services.authentication import UserAuthentication
from ..services.permissions import SuperUserPermissions, HealthcarePracPermissions

import json
import datetime
import numpy as np
from collections import defaultdict
from rest_framework.response import Response
from rest_framework import status
from rest_framework import exceptions
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from pprint import pprint

import logging
logger = logging.getLogger(__name__)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
@permission_classes([SuperUserPermissions | HealthcarePracPermissions])
def get_biomarker_between(request):
    '''
    Request Body:
        REQUIRED start_date (str: yyyy-mm-dd)
        REQUIRED end_date (str: yyyy-mm-dd)
        REQUIRED biomarker (str: can be empty string) 
        REQUIRED periodicity (str) -> day, week, month
        OPTIONAL participant_list (str)
    '''
    try:
        start_date = date_string_to_date(request.data["startDate"])
        end_date = date_string_to_date(request.data["endDate"])
        biomarkers = request.data["biomarker"]
        periodicity = periodicity_mapping[request.data["periodicity"]]
        participants = request.data["participants"]
    except:
        return Response("Invalid request body", status=status.HTTP_400_BAD_REQUEST)

    try:
        if biomarkers == "all":
            biomarkers = [x.biomarker for x in Biomarker.objects.all()]
        else:
            biomarkers = [biomarker_mapping[biomarkers]]
    except:
        return Response("Invalid biomarker specified", status=status.HTTP_400_BAD_REQUEST)

    try:
        if is_valid_start_end_date(start_date, end_date):
            if participants:
                sensorreadings = Sensorreading.objects.filter(
                    participant_id__in=participants,
                    biomarker__in=biomarkers,
                    date__range=[start_date, end_date]
                )
            else:
                sensorreadings = Sensorreading.objects.filter(
                    biomarker__in=biomarkers,
                    date__range=[start_date, end_date]
                )

            result = defaultdict(list)
            method = get_periodicity_method(periodicity)

            for biomarker in biomarkers:

                biomarker_result = defaultdict(list)
                biomarker_readings = sensorreadings.filter(biomarker=biomarker)

                for sensorreading in biomarker_readings:
                    date = str(method(sensorreading.date))
                    biomarker_result[date].append(int(float(sensorreading.value)))

                biomarker_result = fill_missing_dates(biomarker_result, start_date, end_date, periodicity)

                biomarker_result = dict(sorted(biomarker_result.items(), key=lambda x: x[0]))

                # finding average biomarker across month/week/day
                for key, val in biomarker_result.items():
                    if val:
                        biomarker_result[key] = int(sum(val)/len(val))

                for frontend_biomarker, backend_biomarker in biomarker_mapping.items():
                    if biomarker == backend_biomarker:
                        result[frontend_biomarker].append(biomarker_result)

            return Response(json.dumps(result), status=status.HTTP_200_OK)
        else:
            return Response("Start date is later than end date", status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("Server Error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
@permission_classes([SuperUserPermissions | HealthcarePracPermissions])
def get_boxplot(request):
    '''
    Request Body:
        start_date (str: yyyy-mm-dd)
        end_date (str: yyyy-mm-dd)
        biomarker (str)
        periodicity (str) -> day, week, month
    '''
    try:
        start_date = date_string_to_date(request.data["startDate"])
        end_date = date_string_to_date(request.data["endDate"])
        biomarker = request.data["biomarker"]
        periodicity = periodicity_mapping[request.data["periodicity"]]
        participants = request.data["participants"]
    except:
        return Response("Invalid request body", status=status.HTTP_400_BAD_REQUEST)

    try:
        if is_valid_start_end_date(start_date, end_date):
            if biomarker == "all":
                result = defaultdict()
                for frontend_biomarker, backend_biomarker in biomarker_mapping.items():
                    response = boxplot(start_date, end_date, periodicity, backend_biomarker, participants)
                    res = fill_missing_dates(response, start_date, end_date, periodicity)
                    res = dict(sorted(res.items(), key=lambda x: x[0]))
                    result[frontend_biomarker] = res
            else:
                try:
                    biomarker = [biomarker_mapping[biomarker]]
                except:
                    return Response("Invalid biomarker specified", status=status.HTTP_400_BAD_REQUEST)
                response = boxplot(start_date, end_date, periodicity, biomarker, participants)
                result = fill_missing_dates(response, start_date, end_date, periodicity)
                result = dict(sorted(result.items(), key=lambda x: x[0]))

            return Response(json.dumps(result), status=status.HTTP_200_OK)
        else:
            return Response("Start date is later than end date", status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("Internal server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
@permission_classes([SuperUserPermissions | HealthcarePracPermissions])
def plot_boxplot(request):
    '''
    Request Body:
        start_date (str: yyyy-mm-dd)
        end_date (str: yyyy-mm-dd)
        biomarker (str)
        periodicity (str) -> day, week, month
    '''
    try:
        start_date = date_string_to_date(request.data["startDate"])
        end_date = date_string_to_date(request.data["endDate"])
        biomarker = request.data["biomarker"]
        periodicity = periodicity_mapping[request.data["periodicity"]]
        participants = request.data["participants"]
    except:
        return Response("Invalid request body", status=status.HTTP_400_BAD_REQUEST)

    try:
        if is_valid_start_end_date(start_date, end_date):
            if biomarker == 'all':
                result = defaultdict()
                for frontend_biomarker, backend_biomarker in biomarker_mapping.items():
                    response = boxplot(start_date, end_date, periodicity, backend_biomarker, participants)
                    res = fill_missing_dates(response, start_date, end_date, periodicity)
                    res = dict(sorted(res.items(), key=lambda x: x[0]))
                    result[frontend_biomarker] = boxplot_data(res)
            else:
                try:
                    biomarker = biomarker_mapping[biomarker]
                except:
                    return Response("Invalid biomarker specified", status=status.HTTP_400_BAD_REQUEST)

                response = boxplot(start_date, end_date, periodicity, biomarker, participants)
                res = fill_missing_dates(response, start_date, end_date, periodicity)
                res = dict(sorted(res.items(), key=lambda x: x[0]))
                result = boxplot_data(res)

            return Response(json.dumps(result), status=status.HTTP_200_OK)
        else:
            return Response("Start date is later than end date", status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response("Internal server error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def boxplot(start_date, end_date, periodicity, biomarker="", participants=[]):
    '''
    {
        '2021-07-14':{
            'data': [53, 64],
            'outliers': {
                '9001':53,
                '9002':64
            },
            'threshold': [54, 63]
        }
    }
    '''
    if participants:
        sensorreadings = Sensorreading.objects.filter(
            participant_id__in=participants,
            biomarker=biomarker,
            date__range=[start_date, end_date]
        )
    else:
        sensorreadings = Sensorreading.objects.filter(biomarker=biomarker, date__range=[
            start_date, end_date])

    method = get_periodicity_method(periodicity)

    raw_data = defaultdict(lambda: defaultdict(list))

    for sensorreading in sensorreadings:

        date = str(method(sensorreading.date))
        participant_id = sensorreading.participant_id
        value = int(float(sensorreading.value))

        raw_data[date][participant_id].append(value)

    if len(participants) != 1:
        for date, data in raw_data.items():
            for pid, val_arr in data.items():
                raw_data[date][pid] = [int(float(sum(val_arr)/len(val_arr)))]

    result = {}
    for date, data in raw_data.items():
        values = list(data.values())
        q1, q3 = np.percentile(np.array(values), [25, 75], interpolation='midpoint')
        iqr = q3 - q1
        upper_bound = q3 + iqr
        lower_bound = q1 - iqr
        threshold = [lower_bound, upper_bound]

        outliers = defaultdict(list)
        for pid, val in data.items():
            for data_point in val:
                if not lower_bound <= data_point <= upper_bound:
                    outliers[pid].append(data_point)

        for k in outliers.keys():
            outliers[k].sort()
        outliers = dict(sorted(outliers.items()))

        result[date] = {"data": values, "outlier": outliers, "threshold": threshold}
    return result


def boxplot_data(result):
    date_arr = [date for date in result.keys()]
    outlier = defaultdict(list)
    data = []

    for date, value in result.items():
        if value is None:
            data.append([])
        else:
            data.append(value["data"])

            outliers = value["outlier"]
            if len(outliers) > 0:
                for pid, val in outliers.items():
                    outlier[pid].append(
                        dict({'x': date, 'y': val})
                    )

    response = {
        "date": date_arr,
        "outlier": outlier,
        "value": data
    }
    return response
