from django.db import models
from .participant import Participant
from .biomarker import Biomarker
from .device import Device

class Sensorreading(models.Model):
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, max_length=255)
    date = models.DateField()
    biomarker = models.ForeignKey(Biomarker, on_delete=models.CASCADE, max_length=255)
    device = models.ForeignKey(Device, on_delete=models.CASCADE, max_length=255)
    value = models.CharField(max_length=255)

    def __str__(self):
        return "Sensor Reading: " + str(self.biomarker)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['participant', 'date', 'biomarker', 'device'], name='unique reading')
        ]
