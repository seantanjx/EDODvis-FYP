from edodvis.services.migration import daily_migration, device_initial_migration
from edodvis.services.task import device_daily_migration
from edodvis.utils import get_current_datetime
from ..services.authentication import UserAuthentication
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_api_key.permissions import HasAPIKey
from rest_framework import status

@api_view(['POST'])
@authentication_classes([UserAuthentication])
def perform_device_status_update(request):
    try:
        device_daily_migration(get_current_datetime())
    except Exception as e:
        return Response("Daily Migration Failed!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response("Device status updated!", status=status.HTTP_202_ACCEPTED)


# Only accessable via API Key, API Key needs to be generated via django admin, header x-api-key needs to be specified with the authorization token
@api_view(['POST'])
@permission_classes([HasAPIKey])
def perform_daily_update(request):
    try:
        device_initial_migration()
        daily_migration(get_current_datetime())
    except Exception as e:
        return Response("Daily Migration Failed!", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    return Response("Daily Migration Done!", status=status.HTTP_202_ACCEPTED)

# Health check endpoint for AWS
@api_view(['GET'])
def health_check(request):
    return Response("Healthy", status=status.HTTP_200_OK)