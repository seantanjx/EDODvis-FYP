from rest_framework import serializers
from .models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'display_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, data):
        password = data.pop('password', None)
        instance = self.Meta.model(**data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", 'display_name', "role"]


class UserStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['state']

class ParticipantDetailSerializer(serializers.ModelSerializer):
    age = serializers.SerializerMethodField('participant_age')
    postal_district = serializers.SerializerMethodField('participant_postal_district')

    def participant_age(self, participant):
        return participant.age

    def participant_postal_district(self, participant):
        return participant.postal_district
    class Meta:
        model = Participant
        exclude = ('dob', )
class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'


class SensorreadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensorreading


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


class DeviceOverviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        exclude = ['last_updated']


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()
