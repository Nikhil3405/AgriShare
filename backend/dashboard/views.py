from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from bookings.models import Booking
from equipment.models import Equipment

from django.db.models import Count,Sum

class OwnerDashboardView(APIView):
    permission_classes=[IsAuthenticated]
    
    def get(self,request):
        user=request.user
        equipments=Equipment.objects.filter(owner=user)
        bookings=Booking.objects.filter(
            equipment__in=equipments
        )
        total_earnings=bookings.filter(
            status__in=['approved','completed']
        ).aggregate(
            total=Sum('total_price')
        )['total'] or 0
        total_bookings=bookings.count()
        pending_bookings=bookings.filter(
            status='pending'
        ).count()
        completed_bookings=bookings.filter(
            status='completed'
        ).count()
        equipment_count=equipments.count()
        recent_bookings=bookings.order_by(
            '-created_at'
        )[:5].values(
            'id',
            'status',
            'total_price',
            'equipment__name',
            'farmer__username',
        )
        return Response({
            'total_earnings': total_earnings,
            'total_bookings': total_bookings,
            'pending_bookings': pending_bookings,
            'completed_bookings': completed_bookings,
            'equipment_count': equipment_count,
            'recent_bookings': list(recent_bookings),
        })
        

class FarmerDashboardView(APIView):
    permission_classes=[IsAuthenticated]
    
    def get(self,request):
        user=request.user
        bookings=Booking.objects.filter(
            farmer=user
        )
        total_spent=bookings.filter(
            status__in=['approved','completed']
        ).aggregate(
            total=Sum('total_price')
        )['total'] or 0
        
        total_bookings=bookings.count()
        pending_bookings=bookings.filter(
            status='pending'
        ).count()
        completed_bookings=bookings.filter(
            status='completed'
        ).count()
        recent_bookings=bookings.order_by(
            '-created_at'
        )[:5].values(
            'id',
            'status',
            'total_price',
            'equipment__name'
        )
        
        return Response({
            'total_spent': total_spent,
            'total_bookings': total_bookings,
            'pending_bookings': pending_bookings,
            'completed_bookings': completed_bookings,
            'recent_bookings': list(recent_bookings),
        })