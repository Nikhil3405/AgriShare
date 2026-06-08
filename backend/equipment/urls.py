from django.urls import path
from .views import (
    EquipmentListCreateView,
    EquipmentDetailView,
    EquipmentImageUploadView,
    EquipmentImageDeleteView,
    EquipmentImageListView
)

urlpatterns=[
    path(
        '',
        EquipmentListCreateView.as_view(),
        name='equipment-list-create'
    ),
    path(
        '<int:pk>/',
        EquipmentDetailView.as_view(),
        name='equipment-detail'
    ),
    path(
        "<int:pk>/images/",
        EquipmentImageUploadView.as_view(),
        name="equipment-upload-image"
    ),
    path(
        "images/<int:pk>/",
        EquipmentImageDeleteView.as_view(),
        name="equipment-delete-image"
    ),
    path(
        "<int:pk>/images/list/",
        EquipmentImageListView.as_view(),
        name="equipment-image-list"
    ),
]