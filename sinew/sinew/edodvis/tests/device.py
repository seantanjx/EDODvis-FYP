from django.test import TestCase, Client
from rest_framework import status
from main.models import MainDeployment, MainDevice, MainSensorreading
from ..serializers import DeviceOverviewSerializer
from ..models import Device, Participant
from django.db import connection
from django.urls import reverse
import json
from datetime import datetime
from pytz import timezone

# from django.apps import apps

# def change_managed_settings_just_for_tests():
#   """django model managed bit needs to be switched for tests."""

#   unmanaged_models = [m for m in apps.get_models() if not m._meta.managed]
#   for m in unmanaged_models:
#     m._meta.managed = True


client = Client()


class GetAllDeviceTest(TestCase):
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
            battery_level="low",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="room door",
            remarks="Test device"
        )

    def tearDown(self):
        self.participant = None
        self.device = None
        self.device1 = None

    def test_get_devices(self):
        response = client.post(reverse('get_all_devices'))
        devices = Device.objects.all()
        serializer = DeviceOverviewSerializer(devices, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)


class GetDevicesByParticipantIdTest(TestCase):
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
            last_updated=datetime(2022, 1, 1, 8, 0, 0),
            last_serviced=datetime(2022, 1, 1, 8, 0, 0),
            type="motion",
            location="main door",
            remarks="Test device"
        )

        # missing last_updated and last_serviced
        self.device1 = Device.objects.create(
            device_id=2,
            participant=self.participant1,
            name="Edodvis device 2",
            battery_level="low",
            status="online",
            type="motion",
            location="room door",
            remarks="Test device"
        )

    def tearDown(self):
        self.participant = None
        self.participant1 = None
        self.device = None
        self.device1 = None

    def test_missing_participant_id(self):
        response = client.get(reverse('get_devices_by_participant_id', args=[9999]), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, json.dumps({}))

    def test_missing_last_updated_and_last_service(self):
        response = client.get(reverse('get_devices_by_participant_id', args=[1001]), content_type='application/json')
        expected = {"2": {"device_name": "Edodvis device 2",
                          "battery_level": "low",
                          "status": "online",
                          "last_updated": "None",
                          "last_serviced": None,
                          "type": "motion",
                          "location": "room door",
                          "remarks": "Test device",
                          "participant": 1001,
                          "days_down": 0}
                    }
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, json.dumps(expected))

    def test_get_devices_by_participant_id(self):
        response = client.get(reverse('get_devices_by_participant_id', args=[1000]), content_type='application/json')
        expected = {"1": {"device_name": "Edodvis device",
                          "battery_level": "high",
                          "status": "online",
                          "last_updated": "2022-01-01 00:00:00+00:00",
                          "last_serviced": "2022-01-01",
                          "type": "motion",
                          "location": "main door",
                          "remarks": "Test device",
                          "participant": 1000,
                          "days_down": (datetime.now().date() - datetime(2022, 1, 1, 0, 0, 0).date()).days
                          }
                    }
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, json.dumps(expected))


class GetDevicesOverviewDataTest(TestCase):
    def setUp(self):
        # change_managed_settings_just_for_tests()

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
            battery_level="low",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="room door",
            remarks="Test device"
        )

        self.device2 = Device.objects.create(
            device_id=3,
            participant=self.participant1,
            name="Edodvis device 3",
            battery_level="low",
            status="offline",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="main door",
            remarks="Test device"
        )

        connection.cursor().execute(
            "CREATE TABLE main_deployment (id int, participant_id varchar(32), install_date date, uninstall_date date, remarks text);")
        connection.cursor().execute("CREATE TABLE main_device (id int, name varchar(32), type varchar(32), location varchar(32), remarks text, deployment_id int, is_active boolean, install_date date, uninstall_date date);")
        connection.cursor().execute("CREATE TABLE main_sensorreading (id int, gateway_timestamp timestamp with time zone, server_timestamp timestamp with time zone, key varchar(32), value varchar(64), device_id int);")

        self.main_deployment = MainDeployment.objects.create(
            participant_id=1000,
        ).save()

        self.main_device = MainDevice.objects.create(
            name="Sinew device 1",
            type="motion",
            location="main_door",
            remarks="Test device",
            deployment=self.main_deployment,
            is_active=True
        ).save()

        self.main_sensorreading = MainSensorreading.objects.create(
            gateway_timestamp=datetime.now(tz=timezone('Asia/Singapore')),
            server_timestamp=datetime.now(tz=timezone('Asia/Singapore')),
            key='d-01',
            value='255',
            device=self.main_device,
        ).save()

    def tearDown(self):
        self.participant = None
        self.participant1 = None
        self.device = None
        self.device1 = None
        self.device2 = None
        self.main_deployment = None
        self.main_device = None
        self.main_sensorreading = None
        connection.cursor().execute("Drop TABLE main_deployment;")
        connection.cursor().execute("Drop TABLE main_device;")
        connection.cursor().execute("Drop TABLE main_sensorreading;")

    def test_get_devices_overview_data(self):
        response = client.post(
            reverse('get_devices_overview_data'),
            {"postalDistrict": "all"},
            content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GetAllDevicesAndDaysDownTest(TestCase):
    def setUp(self):
        self.participant = Participant.objects.create(participant_id=1000,
                                                      postal_code="653982",
                                                      dob=datetime(1966, 1, 1),
                                                      gender="M",
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

    def tearDown(self):
        self.participant = None
        self.device = None

    def test_get_all_devices_and_days_down(self):
        response = client.post(reverse('get_all_devices_and_days_down'))
        expected = [{"device_id": 1,
                     "name": "Edodvis device",
                     "battery_level": "high",
                     "status": "online",
                     "last_serviced": datetime.now(tz=timezone('Asia/Singapore')).date().isoformat(),
                     "type": "motion",
                     "location": "main door",
                     "participant": 1000,
                     "remarks": "Test device",
                     "days_down": 0}]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, json.dumps(expected))


class GetDevicesOfParticipantTest(TestCase):
    def setUp(self):
        self.participant = Participant.objects.create(participant_id=1000,
                                                      postal_code="653982",
                                                      dob=datetime(1966, 1, 1),
                                                      gender="M",
                                                      medication_required=3)

        self.offline_motion = Device.objects.create(
            device_id=1,
            participant=self.participant,
            name="Edodvis device",
            battery_level="low",
            status="offline",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="main door",
            remarks="Test device"
        )

        self.offline_motion1 = Device.objects.create(
            device_id=2,
            participant=self.participant,
            name="Edodvis device 2",
            battery_level="low",
            status="offline",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="room door",
            remarks="Test device"
        )

        self.online_motion = Device.objects.create(
            device_id=3,
            participant=self.participant,
            name="Edodvis device 3",
            battery_level="low",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="motion",
            location="room 2 door",
            remarks="Test device"
        )

        self.offline_bed = Device.objects.create(
            device_id=4,
            participant=self.participant,
            name="Edodvis device 4",
            battery_level="low",
            status="offline",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="bed",
            location="room bed",
            remarks="Test device"
        )

        self.online_bed = Device.objects.create(
            device_id=5,
            participant=self.participant,
            name="Edodvis device 5",
            battery_level="low",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="bed",
            location="room bed",
            remarks="Test device"
        )

        self.online_bed1 = Device.objects.create(
            device_id=6,
            participant=self.participant,
            name="Edodvis device 6",
            battery_level="low",
            status="online",
            last_updated=datetime.now(tz=timezone('Asia/Singapore')),
            last_serviced=datetime.now(tz=timezone('Asia/Singapore')),
            type="bed",
            location="room 2 bed",
            remarks="Test device"
        )

    def tearDown(self):
        self.participant = None
        self.offline_motion = None
        self.offline_motion1 = None
        self.online_motion = None
        self.offline_bed = None
        self.online_bed = None
        self.online_bed1 = None

    def test_get_valid_participant(self):
        response = client.get(reverse('get_devices_by_participant_id', kwargs={
                              'participant_id': self.participant.participant_id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(json.loads(response.data)), 6)  # there are 6 devices under participant 1000

    def test_get_invalid_participant(self):
        invalid_id = 1001
        response = client.get(reverse('get_devices_by_participant_id', kwargs={'participant_id': invalid_id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(json.loads(response.data)), 0)  # there are no devices under participant 1001


class UpdateLastServiceTest(TestCase):
    def setUp(self):
        self.participant = Participant.objects.create(participant_id=1000,
                                                      postal_code="653982",
                                                      dob=datetime(1966, 1, 1),
                                                      gender="M",
                                                      medication_required=3)

        self.device = Device.objects.create(
            device_id=1,
            participant=self.participant,
            name="Edodvis device",
            battery_level="high",
            status="online",
            last_updated=datetime(2022, 1, 1, 8),
            last_serviced=datetime(2022, 1, 1, 8),
            type="motion",
            location="main door",
            remarks="Test device"
        )

        self.device1 = Device.objects.create(
            device_id=2,
            participant=self.participant,
            name="Edodvis device 2",
            battery_level="high",
            status="offline",
            last_updated=datetime(2022, 1, 1, 8),
            last_serviced=datetime(2022, 1, 1, 8),
            type="motion",
            location="room bed",
            remarks="Test device"
        )

    def teardown(self):
        self.participant = None
        self.device = None
        self.device1 = None

    def test_invalid_request_body(self):
        invalid_body = {'test': ['abc', 123]}
        response = client.post(
            reverse('update_last_service'),
            json.dumps(invalid_body),
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_last_service_invalid_device_id(self):
        invalid_ids = [999, 1000]
        response = client.post(
            reverse('update_last_service'),
            json.dumps({'device_ids': invalid_ids}),
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_last_service(self):
        response = client.post(
            reverse('update_last_service'),
            json.dumps({'device_ids': [1, 2]}),
            content_type="application/json")
        updated_remarks = Device.objects.filter(device_id=1)[0].last_serviced.date()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(updated_remarks, datetime.now().date())


class UpdateRemarksTest(TestCase):
    def setUp(self):
        self.participant = Participant.objects.create(participant_id=1000,
                                                      postal_code="653982",
                                                      dob=datetime(1966, 1, 1),
                                                      gender="M",
                                                      medication_required=3)

        self.device = Device.objects.create(
            device_id=1,
            participant=self.participant,
            name="Edodvis device",
            battery_level="high",
            status="online",
            last_updated=datetime(2022, 1, 1, 8),
            last_serviced=datetime(2022, 1, 1, 8),
            type="motion",
            location="main door",
            remarks="Test device"
        )

        self.device1 = Device.objects.create(
            device_id=2,
            participant=self.participant,
            name="Edodvis device 2",
            battery_level="high",
            status="offline",
            last_updated=datetime(2022, 1, 1, 8),
            last_serviced=datetime(2022, 1, 1, 8),
            type="motion",
            location="room bed",
            remarks="Test device"
        )

    def teardown(self):
        self.participant = None
        self.device = None
        self.device1 = None

    def test_invalid_request_body(self):
        invalid_body = {'test': ['abc', 123], 'remarks': 'tomato'}
        response = client.post(reverse('update_remarks'), json.dumps(invalid_body), content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_remarks_invalid_device_id(self):
        invalid_ids = [999, 1000]
        response = client.post(
            reverse('update_remarks'),
            json.dumps({'device_ids': invalid_ids, 'remarks': 'tomato'}),
            content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_remarks(self):
        response = client.post(reverse('update_remarks'), json.dumps(
            {'device_ids': [1, 2], 'remarks': 'tomato'}), content_type="application/json")
        updated_remarks = Device.objects.filter(device_id=1)[0].remarks
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(updated_remarks, 'tomato')
