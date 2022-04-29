from django.contrib import admin
from .models import User, Participant, Biomarker, Device

# Register your models here.
admin.site.register(User)
admin.site.register(Participant)
admin.site.register(Biomarker)
admin.site.register(Device)