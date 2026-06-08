from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    serializer_class=NotificationSerializer
    permission_classes=[IsAuthenticated]
    
    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')
        
class MarkNotificationReadView(APIView):
    permission_classes=[IsAuthenticated]
    
    def patch(self,request,pk):
        try:
            notification=Notification.objects.get(
                id=pk,
                user=request.user
            )
        except Notification.DoesNotExist:
            return Response(
                {'error':'Not found'},
                status=404
            )
        notification.is_read=True
        notification.save()
        return Response(
            {'message':'Marked as read'}
        )