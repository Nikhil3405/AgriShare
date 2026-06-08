from rest_framework.permissions import BasePermission

class IsEuipmentOwner(BasePermission):
    def has_object_permission(
        self,
        request,
        view,
        obj
    ):
        return (
            obj.equipment.owner==request.user
        )