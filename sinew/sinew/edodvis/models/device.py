from django.db import models
from .participant import Participant

class Device(models.Model):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    UNKNOWN = "unknown"
    BATTERY_LEVELS = [
        (LOW, "low"),
        (MEDIUM, "medium"),
        (HIGH, "high"),
        (UNKNOWN, "unknown"),
    ]

    ONLINE = "online"
    OFFLINE = "offline"
    STATUSES = [
        (ONLINE, "online"),
        (OFFLINE, "offline"),
        (UNKNOWN, "unknown"),
    ]

    device_id = models.IntegerField(primary_key=True)
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, max_length=255)
    name = models.CharField(max_length=255, unique=True)
    battery_level = models.CharField(max_length=255, choices=BATTERY_LEVELS, default=UNKNOWN)
    status = models.CharField(max_length=255,choices=STATUSES, default=UNKNOWN, blank=True, null=True)
    last_updated = models.DateTimeField(null=True, blank=True)
    last_serviced = models.DateTimeField(null=True, blank=True)
    type = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Device: {self.name} is {self.status}"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['device_id', 'participant'], name='unique_device')
        ]