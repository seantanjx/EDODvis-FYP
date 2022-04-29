from django.db import models


class Biomarker(models.Model):
    biomarker = models.CharField(primary_key=True, max_length=255)
    unit = models.CharField(max_length=255)
    description = models.CharField(max_length=255)

    def __str__(self):
        return "Biomarker: " + str(self.biomarker)
