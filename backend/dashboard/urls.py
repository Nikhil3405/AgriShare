from django.urls import path
from .views import (
    OwnerDashboardView,
    FarmerDashboardView,
)

urlpatterns=[
    path(
        'owner/',
        OwnerDashboardView.as_view(),
        name='owner-dashboard'
    ),
    path(
        'farmer/',
        FarmerDashboardView.as_view(),
        name='farmer-dashboard'
    )
]