from django.urls import path

from .views import (
    CreateReviewView,
    EquipmentReviewListView
)

urlpatterns = [
    path(
        "bookings/<int:booking_id>/review/",
        CreateReviewView.as_view()
    ),

    path(
        "equipment/<int:equipment_id>/reviews/",
        EquipmentReviewListView.as_view()
    ),
]