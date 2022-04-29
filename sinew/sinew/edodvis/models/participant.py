from django.db import models
from datetime import date
import random
from ..utils import postal_district_mapping


class Participant(models.Model):
    MALE = "M"
    FEMALE = "F"
    UNKNOWN = "NA"
    GENDER_CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
        (UNKNOWN, 'Unknown'),
    ]

    participant_id = models.BigIntegerField(primary_key=True)
    postal_code = models.CharField(max_length=255, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    risk_profile = models.CharField(blank=True, max_length=255, null=True)
    gender = models.CharField(
        max_length=2,
        choices=GENDER_CHOICES,
        default=UNKNOWN,
        blank=True,
        null=True
    )
    medication_required = models.IntegerField(null=True, default=0)

    @property
    def postal_district(self):
        return postal_district_mapping[self.postal_code[:2]]

    @property
    def age(self):
        try:
            DAYS_IN_YEAR = 365.2425
            age = int((date.today() - self.dob).days / DAYS_IN_YEAR)
            return age
        except:
            return random.randint(50,80)

    def __str__(self):
        return "Participant: " + str(self.participant_id)
