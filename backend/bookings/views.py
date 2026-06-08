from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.db import models
from .models import Booking
from .serializers import BookingSerializer
from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .permissions import IsEuipmentOwner
from notifications.models import Notification
from django.utils import timezone

class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        role = self.request.query_params.get('role')
        status = self.request.query_params.get('status')

        queryset = Booking.objects.all()

        if role == "farmer":
            queryset = queryset.filter(farmer=user)
        elif role == "owner":
            queryset = queryset.filter(equipment__owner=user)
        else:
            # default → show both relevant
            queryset = queryset.filter(
                models.Q(farmer=user) |
                models.Q(equipment__owner=user)
            )

        if status:
            queryset = queryset.filter(status=status)

        return queryset.order_by('-created_at')
        
    def perform_create(self,serializer):
        booking=serializer.save(
            farmer=self.request.user
        )
        Notification.objects.create(
            user=booking.equipment.owner,
            message=f"New booking request for {booking.equipment.name}"
        )
        
class BookingDetailView(generics.RetrieveAPIView):
    queryset=Booking.objects.all()
    serializer_class=BookingSerializer
    permission_classes=[IsAuthenticated]
    
class ApproveBookingView(APIView):
    permission_classes=[IsAuthenticated]
    
    def patch(self,request,pk):
        try:
            booking=Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        if booking.status != 'pending':
            return Response(
                {'error':'Booking already processed'},
                status=400
            )
        permission=IsEuipmentOwner()
        if not permission.has_object_permission(
            request,
            self,
            booking
        ):
            return Response(
                {'error':'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        overlapping = Booking.objects.filter(
            equipment=booking.equipment,
            status__in=["approved", "in_use"],
            start_time__lt=booking.end_time,
            end_time__gt=booking.start_time,
        ).exclude(id=booking.id)

        if overlapping.exists():
            return Response(
                {
                    "error": "Equipment is already booked during this time period"
                },
                status=400
            )
        booking.status='approved'
        Notification.objects.create(
            user=booking.farmer,
            message=f"Your booking for {booking.equipment.name} has been approved"
        )
        booking.save()
        booking.equipment.save()
        serializer=BookingSerializer(
    booking,
    context={'request': request}
)
        return Response(serializer.data)
    
class RejectBookingView(APIView):
    permission_classes=[IsAuthenticated]
    
    def patch(self,request,pk):
        try:
            booking=Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        if booking.status != 'pending':
            return Response(
                {'error':'Booking already processed'},
                status=400
            )
        permission=IsEuipmentOwner()
        if not permission.has_object_permission(
            request,
            self,
            booking
        ):
            return Response(
                {'error':'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        booking.status='rejected'
        Notification.objects.create(
            user=booking.farmer,
            message=f"Your booking for {booking.equipment.name} was rejected"
        )
        booking.save()
        serializer=BookingSerializer(
    booking,
    context={'request': request}
)
        return Response(serializer.data)


class RequestReturnView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Not found"},
                status=404
            )

        if booking.farmer != request.user:
            return Response(
                {"error": "Permission denied"},
                status=403
            )

        if booking.status != "in_use":
            return Response(
                {"error": "Booking is not currently in use"},
                status=400
            )

        booking.status = "return_requested"
        booking.returned_at = timezone.now()

        booking.save()

        Notification.objects.create(
            user=booking.equipment.owner,
            message=f"{booking.farmer.username} requested return of {booking.equipment.name}"
        )

        return Response(
            BookingSerializer(
                booking,
                context={"request": request}
            ).data
        )

class HandOverBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Not found"},
                status=404
            )

        permission = IsEuipmentOwner()

        if not permission.has_object_permission(
            request,
            self,
            booking
        ):
            return Response(
                {"error": "Permission denied"},
                status=403
            )

        if booking.status != "approved":
            return Response(
                {"error": "Booking must be approved first"},
                status=400
            )

        booking.status = "in_use"
        booking.started_at = timezone.now()
        booking.equipment.is_available = False
        booking.equipment.save()

        booking.save()

        Notification.objects.create(
            user=booking.farmer,
            message=f"{booking.equipment.name} has been handed over and rental has started"
        )

        return Response(
            BookingSerializer(
                booking,
                context={"request": request}
            ).data
        )
        
class ReturnBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

        if booking.farmer != request.user:
            return Response({'error': 'Permission denied'}, status=403)
        if booking.status != 'completed':
            return Response(
                {'error':'Booking already processed'},
                status=400
            )
        booking.status='return_requested'
        booking.returned_at = timezone.now()
        booking.save()

        Notification.objects.create(
            user=booking.equipment.owner,
            message=f"{booking.equipment.name} has been returned"
        )

        return Response(BookingSerializer(
    booking,
    context={'request': request}
).data)
    
class ConfirmReturnView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response(
                {"error": "Not found"},
                status=404
            )

        permission = IsEuipmentOwner()

        if not permission.has_object_permission(
            request,
            self,
            booking
        ):
            return Response(
                {"error": "Permission denied"},
                status=403
            )

        if booking.status != "return_requested":
            return Response(
                {"error": "Return has not been requested"},
                status=400
            )

        booking.status = "completed"
        booking.completed_at = timezone.now()

        booking.save()

        booking.equipment.is_available = True
        booking.equipment.save()

        Notification.objects.create(
            user=booking.farmer,
            message=f"Return confirmed for {booking.equipment.name}"
        )

        return Response(
            BookingSerializer(
                booking,
                context={"request": request}
            ).data
        )
        
class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        earned = Booking.objects.filter(
            equipment__owner=request.user,
            status="completed"
        ).aggregate(
            total=Sum("total_price")
        )["total"] or 0

        spent = Booking.objects.filter(
            farmer=request.user,
            status="completed"
        ).aggregate(
            total=Sum("total_price")
        )["total"] or 0

        completed_rentals = Booking.objects.filter(
            farmer=request.user,
            status="completed"
        ).count()

        active_rentals = Booking.objects.filter(
            farmer=request.user,
            status__in=[
                "approved",
                "handed_over",
                "in_use",
                "return_requested"
            ]
        ).count()

        monthly_earnings = (
            Booking.objects.filter(
                equipment__owner=request.user,
                status="completed"
            )
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(total=Sum("total_price"))
            .order_by("month")
        )

        monthly_spending = (
            Booking.objects.filter(
                farmer=request.user,
                status="completed"
            )
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(total=Sum("total_price"))
            .order_by("month")
        )

        return Response({
            "total_earned": round(float(earned), 2),
            "total_spent": round(float(spent), 2),
            "completed_rentals": completed_rentals,
            "active_rentals": active_rentals,
            "monthly_earnings": [
                {
                    "month": item["month"].strftime("%b"),
                    "total": round(float(item["total"]), 2)
                }
                for item in monthly_earnings
            ],
            "monthly_spending": [
                {
                    "month": item["month"].strftime("%b"),
                    "total": round(float(item["total"]), 2)
                }
                for item in monthly_spending
            ],
        })
        
        