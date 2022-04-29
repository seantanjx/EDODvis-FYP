from django.test import TestCase, Client
from rest_framework import status
from ..serializers import ParticipantDetailSerializer
from ..models import Participant
from django.urls import reverse

client = Client()


class GetAllParticipantsTest(TestCase):
    def setUp(self):
        Participant(participant_id=1000,
                    postal_code="653982",
                    dob="1967-01-01",
                    gender="M",
                    medication_required=3).save()

        Participant(participant_id=1001,
                    postal_code="653982",
                    dob="1972-01-01",
                    gender="F",
                    medication_required=3).save()

    def tearDown(self):
        pass

    def test_get_participants(self):
        response = client.post(reverse('get_all_participants'), content_type="application/json")
        participants = Participant.objects.all()
        serializer = ParticipantDetailSerializer(participants, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        print(serializer.data)
        self.assertEqual(response.data, serializer.data)


class GetParticipantsByIdTest(TestCase):
    def setUp(self):
        self.participant = Participant.objects.create(participant_id=1000,
                                                      postal_code="653982",
                                                      dob="1967-01-01",
                                                      gender="M",
                                                      medication_required=3)

    def tearDown(self):
        self.participant = None

    def test_get_participants(self):
        response = client.get(reverse('get_participant_by_id', args=[1000]), content_type="application/json")
        participant = Participant.objects.get(participant_id=1000)
        serializer = ParticipantDetailSerializer(participant)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_get_non_existing_participant(self):
        response = client.get(reverse('get_participant_by_id', args=[1111]), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class GetParticipantByPostalCode(TestCase):
    def setUp(self):
        self.participant = Participant.objects.create(participant_id=1000,
                                                      postal_code="653982",
                                                      dob="1967-01-01",
                                                      gender="M",
                                                      medication_required=3)

    def tearDown(self):
        self.participant = None

    def test_get_participant_by_postal_code(self):
        response = client.post(
            reverse('get_participant_by_postal_code'),
            {"postal_code": "653982"},
            content_type='application/json')
        participants = Participant.objects.filter(postal_code="653982")
        serializer = ParticipantDetailSerializer(participants, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_get_participant_by_non_existing_postal_code(self):
        response = client.post(
            reverse('get_participant_by_postal_code'),
            {'postal_code': '999999'},
            content_type='application/json')
        participants = Participant.objects.filter(postal_code="999999")
        serializer = ParticipantDetailSerializer(participants, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
