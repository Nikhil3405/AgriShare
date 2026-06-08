from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .permissions import IsOwnerOrReadOnly
from .models import Equipment
from .serializers import EquipmentSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import EquipmentImage
from .serializers import EquipmentImageSerializer

class EquipmentListCreateView(generics.ListCreateAPIView):
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Equipment.objects.all().order_by('-created_at')

        search = self.request.query_params.get('search')
        location = self.request.query_params.get('location')
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        equipment_type = self.request.query_params.get('equipment_type')
        mine = self.request.query_params.get('mine')

        if search:
            queryset = queryset.filter(
                name__icontains=search
            )

        if location:
            queryset = queryset.filter(
                location__icontains=location
            )

        if min_price:
            queryset = queryset.filter(
                hourly_rate__gte=min_price
            )

        if max_price:
            queryset = queryset.filter(
                hourly_rate__lte=max_price
            )
            
        if equipment_type:
            queryset = queryset.filter(
                equipment_type=equipment_type
            )

        if mine == 'true':
            if not self.request.user.is_authenticated:
                return Equipment.objects.none()

            queryset = queryset.filter(
                owner=self.request.user
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class EquipmentDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly
    ]
    
class EquipmentImageUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            equipment = Equipment.objects.get(pk=pk)
        except Equipment.DoesNotExist:
            return Response(
                {"error": "Equipment not found"},
                status=404
            )

        if equipment.owner != request.user:
            return Response(
                {"error": "Permission denied"},
                status=403
            )

        serializer = EquipmentImageSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save(
                equipment=equipment
            )

            return Response(
                serializer.data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )
        
class EquipmentImageDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        try:
            image = EquipmentImage.objects.get(pk=pk)
        except EquipmentImage.DoesNotExist:
            return Response(
                {"error": "Image not found"},
                status=404
            )

        if image.equipment.owner != request.user:
            return Response(
                {"error": "Permission denied"},
                status=403
            )

        if image.equipment.images.count() <= 1:
            return Response(
                {
                    "error":
                    "At least one image is required"
                },
                status=400
            )

        image.delete()

        return Response(status=204)
    
class EquipmentImageListView(APIView):

    def get(self, request, pk):
        try:
            equipment = Equipment.objects.get(pk=pk)
        except Equipment.DoesNotExist:
            return Response(
                {"error": "Equipment not found"},
                status=404
            )

        serializer = EquipmentImageSerializer(
            equipment.images.all(),
            many=True
        )

        return Response(serializer.data)