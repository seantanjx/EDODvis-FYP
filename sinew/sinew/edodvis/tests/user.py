from django.test import TestCase, Client
from rest_framework import status
from django.urls import reverse

import json

client = Client()


class CreateUserTest(TestCase):
    def setUp(self):
        self.validPayload = {
            "username": "dummy1",
            "password": "12345678",
            "display_name": "dummy1",
            "role": "SU"
        }

        self.invalidPayload = {
            "username": "dummy2",
            "password": "*****",  # invalid password
            "role": "SU"
        }

    def tearDown(self):
        self.validPayload = None
        self.invalidPayload = None

    def test_create_valid_user(self):
        response = client.post(reverse("create_user"),
                               data=json.dumps(self.validPayload),
                               content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_user(self):
        response = client.post(reverse("create_user"),
                               data=json.dumps(self.invalidPayload),
                               content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginTest(TestCase):
    def setUp(self):
        self.participant = client.post(reverse("create_user"),
                                       data=json.dumps({
                                           "username": "dummy1",
                                           "password": "12345678",
                                           "display_name": "dummy1",
                                           "role": "SU"
                                       }),
                                       content_type="application/json")

    def tearDown(self):
        self.participant = None

    def test_login(self):
        response = client.post(reverse("login"),
                               {'username': 'dummy1', 'password': '12345678'},
                               content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(json.loads(response.content)['detail'], "User not verified")

    def test_non_existing_user_login(self):
        response = client.post(reverse("login"),
                               {'username': 'fake', 'password': '12345678'},
                               content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(json.loads(response.content)['detail'], "User not found!")

    def test_incorrect_password_login(self):
        response = client.post(reverse("login"),
                               {'username': 'dummy1', 'password': '*****'},
                               content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
