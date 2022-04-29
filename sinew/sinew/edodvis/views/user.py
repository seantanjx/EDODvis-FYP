import logging
from unittest import case
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework import status
import re
import jwt
import datetime
import json

from ..services.authentication import UserAuthentication, getTokenPayload
from ..services.permissions import SuperUserPermissions, DataEngineerPermissions, HealthcarePracPermissions
from ..serializers import UserSerializer, UserStateSerializer, UserDetailSerializer
from ..models import User

import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# need to set auth and permissions when implementing


@api_view(['POST'])
def create_user(request):
    if not isValidPassword(request.data["password"]):
        raise ValidationError("Invalid password (minimum 8 characters)")

    serializer = UserSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    username = request.data["username"]
    password = request.data["password"]

    user = User.objects.filter(username=username).first()

    if user is None:
        raise AuthenticationFailed("User not found!")

    if user.role == "UN":
        raise AuthenticationFailed("User not verified")

    if not user.check_password(password):
        raise AuthenticationFailed("Incorrect password!")

    user.last_login = datetime.datetime.utcnow()
    user.save()

    payload = {
        'username': user.username,
        'role': user.role,
        'display_name': user.display_name,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=12),
        'iat': datetime.datetime.utcnow()
    }

    token = jwt.encode(payload, os.environ.get("TOKEN_SECRET"), algorithm="HS256")

    return Response({"token": token}, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def get_user_by_token(request):
    try:
        token = request.headers["Authorization"]

        payload = getTokenPayload(token)

        user = User.objects.filter(username=payload["username"]).first()
        serializer = UserDetailSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)
    except:
        return Response("No token found", status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'PATCH'])
@authentication_classes([UserAuthentication])
def user_state(request):
    token = request.headers["Authorization"]
    payload = getTokenPayload(token)
    user = User.objects.filter(username=payload["username"]).first()

    if request.method == 'PATCH':
        try:
            state = request.data["state"]

            user.state = state
            user.save()
            return Response("State saved", status=status.HTTP_200_OK)
        except:
            return Response("Invalid request body", status=status.HTTP_400_BAD_REQUEST)
    else:
        if user.state:
            return Response(json.dumps(user.state), status=status.HTTP_200_OK)
        else:
            return Response(None, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@authentication_classes([UserAuthentication])
def logout(request):
    response = Response()
    response.delete_cookie('jwt')
    response.data = {
        "message": "User logged out"
    }
    return response


def isValidPassword(password):
    if re.fullmatch(r'[A-Za-z0-9@#$%^&+=]{8,}', password):
        return True
    return False


