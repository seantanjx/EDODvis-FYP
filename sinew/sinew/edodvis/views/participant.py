from django.db.models import Q
import json
import pandas as pd
from datetime import date
from collections import defaultdict
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework import status

from ..models import Participant, Device
from ..serializers import ParticipantSerializer, FileUploadSerializer, ParticipantDetailSerializer
from ..services.authentication import UserAuthentication
from ..services.permissions import HealthcarePracPermissions, SuperUserPermissions

from ..utils import is_valid_postal_code, get_current_datetime

import logging
logger = logging.getLogger(__name__)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_all_participants(request):
    try:
        all_participants = Participant.objects.all()
    except Participant.DoesNotExist:
        return Response("No participants found", status=status.HTTP_404_NOT_FOUND)
    serializer = ParticipantDetailSerializer(all_participants, context={
        'request': request}, many=True)
    if serializer:
        return Response(sorted(serializer.data, key=lambda x: x['participant_id']), status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([UserAuthentication])
def get_participant_by_id(request, participant_id):
    try:
        participant = Participant.objects.get(participant_id=participant_id)
    except Participant.DoesNotExist:
        return Response("No participants found", status=status.HTTP_404_NOT_FOUND)
    serializer = ParticipantDetailSerializer(
        participant, context={'request': request})
    if serializer:
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_participant_by_postal_district(request):
    try:
        postal_district = request.data["postalDistrict"]
        participants = Participant.objects.all()
        if postal_district != 'all':
            participants = [participant for participant in participants
                            if participant.postal_district == int(postal_district)]
    except Participant.DoesNotExist:
        return Response("No participants found", status=status.HTTP_404_NOT_FOUND)
    serializer = ParticipantDetailSerializer(
        participants, context={'request': request}, many=True)
    if serializer:
        return Response(sorted(serializer.data, key=lambda x: x['participant_id']), status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_participant_by_postal_code(request):
    try:
        postal_code = request.data["postal_code"]
        participants = Participant.objects.filter(postal_code=postal_code)
    except Participant.DoesNotExist:
        return Response("No participants found", status=status.HTTP_404_NOT_FOUND)
    serializer = ParticipantDetailSerializer(
        participants, context={'request': request}, many=True)
    if serializer:
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_participants_with_alerts(request):
    try:
        devices_with_alerts = Device.objects.filter(
            Q(battery_level="low") | Q(status="offline"))
    except Device.DoesNotExist:
        return Response("No devices found", status=status.HTTP_404_NOT_FOUND)

    # creating json format per participant
    try:
        res = defaultdict(list)

        for row in devices_with_alerts:
            participant_id = row.participant_id

            type = row.type
            if participant_id not in res:
                res[participant_id] = [type]
            elif type not in res[participant_id]:
                res[participant_id].append(type)

        res = dict(sorted(res.items()))
        return Response(json.dumps(res), status=status.HTTP_200_OK)
    except:
        return Response("Internal Server Error", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@authentication_classes([UserAuthentication])
def upload_participant_csv(request):
    serializer = FileUploadSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    file = serializer.validated_data['file']
    reader = pd.read_excel(file)
    exists = []
    added = []
    for _, row in reader.iterrows():
        participant = {k.replace(' ', ''): v for k, v in dict(row).items()}
        if validate_participant(participant):
            success, participant_id = create_participant(participant)
            if success:
                added.append(participant_id)
            else:
                exists.append(participant_id)
        else:
            return Response(f"Excel sheet parse error. Check that file format is correct.",
                            status=status.HTTP_400_BAD_REQUEST)
    exists = ",".join(exists)
    added = ",".join(added)
    return Response(f"Participants {added} added, and participants {exists} already exists.",
                    status=status.HTTP_201_CREATED)


def create_participant(participant):
    '''
    {'SerialNo.': 9093, 'Location': 'Yishun Ave 11', 'Gender': 'F', 'PostalCode': 's763426', 'DOB': 17/09/1945}
    '''
    try:
        participant_id = participant["SerialNo."]
        gender = participant["Gender"].strip().upper()
        dob = participant["DOB"].date()
        postal_code = participant["PostalCode"][1:]
        medication_required = 3
    except:
        return False, ""

    try:
        participant = Participant.objects.get(pk=participant_id)
        participant.postal_code = postal_code
        participant.dob = dob
        participant.save()
        return False, str(participant_id)
    except Participant.DoesNotExist:
        payload = {
            "participant_id": participant_id,
            "postal_code": postal_code,
            "gender": gender,
            "dob": dob,
            "medication_required": medication_required
        }

        serializer = ParticipantSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return True, str(participant_id)


def validate_participant(participant):
    try:
        if type(
                participant["SerialNo."]) is int and participant["Gender"].strip().upper() in (
                'M', 'F') and is_valid_postal_code(
                participant["PostalCode"]) and participant["DOB"].date() < get_current_datetime().date():
            return True
        else:
            return False
    except:
        return False
