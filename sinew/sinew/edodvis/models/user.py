from django.db import models
from django.contrib.auth.models import AbstractBaseUser


class User(AbstractBaseUser):

    PRACTITIONER = "HP"
    ENGINEER = "DE"
    SUPERUSER = "SU"
    UNVERIFIED = "UN"

    ROLE_CHOICES = [
        (PRACTITIONER, 'Healthcare Practitioner'),
        (ENGINEER, 'Data Engineer'),
        (SUPERUSER, 'Super User'),
        (UNVERIFIED, 'Unverified'),
    ]

    username = models.CharField(primary_key=True, max_length=255)
    display_name = models.CharField(max_length=255)
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default=UNVERIFIED
    )
    state = models.JSONField(null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"Username: {self.username}, Role: {self.role}"
