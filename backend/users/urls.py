from django.urls import path
from .views import RegisterView, CustomTokenView, ProfileView, ChangePasswordView

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns=[
    path('register/',
         RegisterView.as_view(),
         name='register'),
    path('login/',
         CustomTokenView.as_view(),
         name='token_obtain_pair'),
    path('refresh/',
         TokenRefreshView.as_view(),
         name='token_refresh'),
     path(
     "profile/",
     ProfileView.as_view()
     ),
     path(
    "change-password/",
    ChangePasswordView.as_view()
),
]