from rest_framework.authentication import BasicAuthentication
from rest_framework.exceptions import AuthenticationFailed, PermissionDenied
import jwt

from ..models import User
import os
from dotenv import load_dotenv

load_dotenv()

def getTokenPayload(token):
    try:
        payload = jwt.decode(token, os.environ.get("TOKEN_SECRET"), algorithms="HS256")
        return payload

    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Expired token!")

    except jwt.InvalidSignatureError:
        raise AuthenticationFailed("Invalid signature!")

    except jwt.DecodeError:
        raise AuthenticationFailed("Corrupted token!")

    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Invalid token!")

class UserAuthentication(BasicAuthentication):
    def authenticate(self, request):
        '''
        Overrides authenticate method from BasicAuthentication class
        '''
        if not 'Authorization' in request.headers:
            raise PermissionDenied('No token found')
        else:
            token = request.headers["Authorization"]
            payload = getTokenPayload(token)
            user = User.objects.filter(username=payload["username"]).first()

            if user is None:
                raise AuthenticationFailed('User not found', code=404)
            return (user, None)
