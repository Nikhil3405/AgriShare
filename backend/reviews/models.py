from django.db import models
from django.conf import settings

from equipment.models import Equipment
from bookings.models import Booking
# Create your models here.
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    reviewer=models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    
    equipment=models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    booking=models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
    )
    rating = models.IntegerField(
    validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.reviewer.username} - {self.rating}"