from django.db import models
from django.conf import settings
from decimal import Decimal
from equipment.models import Equipment
# Create your models here.
class Booking(models.Model):

    STATUS_CHOICES = (
    ("pending", "Pending"),
    ("approved", "Approved"),
    ("in_use", "In Use"),
    ("return_requested", "Return Requested"),
    ("completed", "Completed"),
    ("rejected", "Rejected"),
    ("cancelled", "Cancelled"),
    )

    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='bookings'
    )

    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    # ✅ NEW tracking fields
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    returned_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.start_time and self.end_time:
            self.total_price = (
                self.duration_hours *
                self.equipment.hourly_rate
            )

        super().save(*args, **kwargs)

    @property
    def duration_hours(self):
        return Decimal(
            str(
                (self.end_time - self.start_time)
                .total_seconds() / 3600
            )
        )
            
    def __str__(self):
        return f"{self.farmer.username} - {self.equipment.name}"