from rest_framework.permissions import BasePermission


class SuperUserPermissions(BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.role == "SU"
        )


class DataEngineerPermissions(BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.role == "DE"
        )


class HealthcarePracPermissions(BasePermission):

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.role == "HP"
        )
