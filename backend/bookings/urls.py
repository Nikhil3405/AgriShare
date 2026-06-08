from django.urls import path

from .views import (
    BookingListCreateView,
    BookingDetailView,
    ApproveBookingView,
    RejectBookingView,
    RequestReturnView,
    ReturnBookingView,
    ConfirmReturnView,
    HandOverBookingView,
    AnalyticsView
)

urlpatterns=[
    path(
        '',
        BookingListCreateView.as_view(),
        name='booking-list-create'
    ),
    path(
        '<int:pk>/',
        BookingDetailView.as_view(),
        name='booking-detail'
    ),
    path(
        '<int:pk>/approve/',
        ApproveBookingView.as_view(),
        name='approve-booking'
    ),
    path(
        '<int:pk>/reject/',
        RejectBookingView.as_view(),
        name='reject-booking'
    ),
    path('<int:pk>/request-return/', RequestReturnView.as_view()),
    path('<int:pk>/return/', ReturnBookingView.as_view()),
    path('<int:pk>/confirm/', ConfirmReturnView.as_view()),
    path('<int:pk>/handover/', HandOverBookingView.as_view()),
    path(
        "analytics/",
        AnalyticsView.as_view(),
        name="analytics"
    )
]