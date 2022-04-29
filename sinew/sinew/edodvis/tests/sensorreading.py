from django.test import TestCase, Client
from rest_framework import status
from ..models import Device, Participant, Biomarker, Sensorreading
from django.urls import reverse
import json
from datetime import datetime
from pytz import timezone

client = Client()


class GetBiomarkerBetweenTest(TestCase):
    def setUp(self):
        self.participant = Participant.objects.create(
            participant_id=1000,
            postal_code="653982",
            dob=datetime(1966, 1, 1),
            gender="M",
            medication_required=3
        )

        self.device = Device.objects.create(
            device_id=1,
            participant=self.participant,
            name="Edodvis device",
            battery_level="high",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="main door",
            remarks="Test device"
        )

        self.device1 = Device.objects.create(
            device_id=2,
            participant=self.participant,
            name="Edodvis device 2",
            battery_level="high",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="living room",
            remarks="Test device"
        )

        self.sensorreading = Sensorreading.objects.create(
            participant=self.participant,
            date=datetime.now(tz=timezone('Asia/Singapore')),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="0"
        )

    def tearDown(self):
        self.participant = None
        self.device = None
        self.device1 = None
        self.sensorreading = None

    def test_invalid_request_body(self):
        invalid_body = {
            "startDate": "2022-01-01",
            "endDate": "2022-02-01",
            "biomarker": "forgottenKeys",
            "periodicity": "monthly",  # invalid parameter
            "participants": [1000]
        }
        response = client.post(
            reverse('get_biomarker_between'),
            json.dumps(invalid_body),
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_start_end_date(self):
        invalid_body = {
            "startDate": "2022-04-01",  # start date after end date
            "endDate": "2022-01-01",
            "biomarker": "forgottenKeys",
            "periodicity": "monthly",
            "participants": [1000]
        }
        response = client.post(
            reverse('get_biomarker_between'),
            json.dumps(invalid_body),
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_request_body(self):
        valid_body = {
            "startDate": "2022-01-01",
            "endDate": "2022-01-31",
            "biomarker": "forgottenKeys",
            "periodicity": "month",
            "participants": [1000]
        }
        response = client.post(
            reverse('get_biomarker_between'),
            json.dumps(valid_body),
            content_type="application/json")
        expected = json.dumps({"forgottenKeys": [{"2022-01-01": None}]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected)


class GetBoxPlotTest(TestCase):
    def setUp(self):
        self.participant = Participant.objects.create(participant_id=1000,
                                                      postal_code="653982",
                                                      dob=datetime(1966, 1, 1),
                                                      gender="M",
                                                      medication_required=3)

        self.participant1 = Participant.objects.create(participant_id=1001,
                                                       postal_code="6512314",
                                                       dob=datetime(1972, 1, 1),
                                                       gender="F",
                                                       medication_required=3)

        self.device = Device.objects.create(
            device_id=1,
            participant=self.participant,
            name="Edodvis device",
            battery_level="high",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="main door",
            remarks="Test device"
        )

        self.device1 = Device.objects.create(
            device_id=2,
            participant=self.participant,
            name="Edodvis device 2",
            battery_level="high",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="living room",
            remarks="Test device"
        )

        self.sensorreading = Sensorreading.objects.create(
            participant=self.participant,
            date=datetime(2022, 1, 1, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="0"
        )

        self.sensorreading1 = Sensorreading.objects.create(
            participant=self.participant,
            date=datetime(2022, 1, 2, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="3"
        )

        self.sensorreading2 = Sensorreading.objects.create(
            participant=self.participant,
            date=datetime(2022, 1, 3, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="2"
        )

        self.sensorreading3 = Sensorreading.objects.create(
            participant=self.participant,
            date=datetime(2022, 1, 4, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="1000"
        )

        self.sensorreading4 = Sensorreading.objects.create(
            participant=self.participant1,
            date=datetime(2022, 1, 1, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="0"
        )

        self.sensorreading5 = Sensorreading.objects.create(
            participant=self.participant1,
            date=datetime(2022, 1, 2, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="3"
        )

        self.sensorreading6 = Sensorreading.objects.create(
            participant=self.participant1,
            date=datetime(2022, 1, 3, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="2"
        )

        self.sensorreading7 = Sensorreading.objects.create(
            participant=self.participant1,
            date=datetime(2022, 1, 4, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="1"
        )

    def tearDown(self):
        self.participant = None
        self.device = None
        self.device1 = None
        self.sensorreading = None
        self.sensorreading1 = None
        self.sensorreading2 = None
        self.sensorreading3 = None
        self.sensorreading4 = None
        self.sensorreading5 = None
        self.sensorreading6 = None
        self.sensorreading7 = None

    def test_invalid_request_body(self):
        invalid_body = {
            "startDate": "2022-01-01",
            "endDate": "2022-02-01",
            "biomarker": "forgottenKeys",
            "periodicity": "monthly",  # invalid parameter
            "participants": [1000, 1001]
        }
        response = client.post(reverse('plot_boxplot'), json.dumps(invalid_body), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_start_end_date(self):
        invalid_body = {
            "startDate": "2022-04-01",  # start date after end date
            "endDate": "2022-01-01",
            "biomarker": "forgottenKeys",
            "periodicity": "monthly",
            "participants": [1000, 1001]
        }
        response = client.post(reverse('plot_boxplot'), json.dumps(invalid_body), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_request_body(self):
        valid_body = {
            "startDate": "2022-01-01",
            "endDate": "2022-01-31",
            "biomarker": "forgottenKeys",
            "periodicity": "month",
            "participants": [1000, 1001]
        }
        response = client.post(reverse('plot_boxplot'), json.dumps(valid_body), content_type="application/json")
        expected = json.dumps(
            {"date": ["2022-01-01"],
             "outlier": {"1000": [{"x": "2022-01-01", "y": [251]}],
                         "1001": [{"x": "2022-01-01", "y": [1]}]},
             "value": [[[251],
                        [1]]]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected)


class PlotBoxPlotTest(TestCase):
    def setUp(self):
        self.participant = Participant.objects.create(participant_id=1000,
                                                      postal_code="653982",
                                                      dob=datetime(1966, 1, 1),
                                                      gender="M",
                                                      medication_required=3)

        self.participant1 = Participant.objects.create(participant_id=1001,
                                                       postal_code="6512314",
                                                       dob=datetime(1972, 1, 1),
                                                       gender="F",
                                                       medication_required=3)

        self.device = Device.objects.create(
            device_id=1,
            participant=self.participant,
            name="Edodvis device",
            battery_level="high",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="main door",
            remarks="Test device"
        )

        self.device1 = Device.objects.create(
            device_id=2,
            participant=self.participant,
            name="Edodvis device 2",
            battery_level="high",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="living room",
            remarks="Test device"
        )

        self.sensorreading = Sensorreading.objects.create(
            participant=self.participant,
            date=datetime(2022, 1, 1, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="0"
        )

        self.sensorreading1 = Sensorreading.objects.create(
            participant=self.participant,
            date=datetime(2022, 1, 2, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="3"
        )

        self.sensorreading2 = Sensorreading.objects.create(
            participant=self.participant,
            date=datetime(2022, 1, 3, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="2"
        )

        self.sensorreading3 = Sensorreading.objects.create(
            participant=self.participant,
            date=datetime(2022, 1, 4, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="1000"
        )

        self.sensorreading4 = Sensorreading.objects.create(
            participant=self.participant1,
            date=datetime(2022, 1, 1, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="0"
        )

        self.sensorreading5 = Sensorreading.objects.create(
            participant=self.participant1,
            date=datetime(2022, 1, 2, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="3"
        )

        self.sensorreading6 = Sensorreading.objects.create(
            participant=self.participant1,
            date=datetime(2022, 1, 3, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="2"
        )

        self.sensorreading7 = Sensorreading.objects.create(
            participant=self.participant1,
            date=datetime(2022, 1, 4, 8),
            biomarker=Biomarker.objects.get(biomarker='forgotten_keys'),
            device=self.device,
            value="1"
        )

    def tearDown(self):
        self.participant = None
        self.device = None
        self.device1 = None
        self.sensorreading = None
        self.sensorreading1 = None
        self.sensorreading2 = None
        self.sensorreading3 = None
        self.sensorreading4 = None
        self.sensorreading5 = None
        self.sensorreading6 = None
        self.sensorreading7 = None

    def test_invalid_request_body(self):
        invalid_body = {
            "startDate": "2022-01-01",
            "endDate": "2022-01-31",
            "biomarker": "forgottenKeys",
            "periodicity": "monthly",  # invalid parameter
            "participants": [1000]
        }
        response = client.post(reverse('plot_boxplot'), json.dumps(invalid_body), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_start_end_date(self):
        invalid_body = {
            "startDate": "2022-04-01",  # start date after end date
            "endDate": "2022-01-01",
            "biomarker": "forgottenKeys",
            "periodicity": "monthly",
            "participants": [1000]
        }
        response = client.post(reverse('plot_boxplot'), json.dumps(invalid_body), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_request_body(self):
        valid_body = {
            "startDate": "2022-01-01",
            "endDate": "2022-01-31",
            "biomarker": "forgottenKeys",
            "periodicity": "month",
            "participants": [1000, 1001]
        }
        response = client.post(reverse('plot_boxplot'), json.dumps(valid_body), content_type="application/json")
        expected = json.dumps(
            {"date": ["2022-01-01"],
             "outlier": {"1000": [{"x": "2022-01-01", "y": [251]}],
                         "1001": [{"x": "2022-01-01", "y": [1]}]},
             "value": [[[251],
                        [1]]]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected)
