from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from bookings.models import Booking
from equipment.models import Equipment

from .models import Review
from .serializers import ReviewSerializer

class CreateReviewView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(
                id=booking_id
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"},
                status=404
            )

        if booking.farmer != request.user:
            return Response(
                {"error": "Permission denied"},
                status=403
            )

        if booking.status != "completed":
            return Response(
                {
                    "error":
                    "Only completed bookings can be reviewed"
                },
                status=400
            )

        if hasattr(booking, "review"):
            return Response(
                {
                    "error":
                    "Review already submitted"
                },
                status=400
            )

        serializer = ReviewSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save(
                reviewer=request.user,
                booking=booking,
                equipment=booking.equipment
            )

            return Response(
                serializer.data,
                status=201
            )

        return Response(
            serializer.errors,
            status=400
        )     
        
class EquipmentReviewListView(APIView):

    def get(self, request, equipment_id):
        reviews = Review.objects.filter(
            equipment_id=equipment_id
        ).order_by("-created_at")

        serializer = ReviewSerializer(
            reviews,
            many=True
        )

        return Response(serializer.data)