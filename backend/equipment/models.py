from django.db import models
from django.conf import settings
from django.db.models import Avg


class Equipment(models.Model):
    EQUIPMENT_TYPES = (
        ('tractor', 'Tractor'),
        ('harvester', 'Harvester'),
        ('rotavator', 'Rotavator'),
        ('cultivator', 'Cultivator'),
        ('plough', 'Plough'),
        ('seeder', 'Seeder'),
        ('sprayer', 'Sprayer'),
        ('thresher', 'Thresher'),
        ('trailer', 'Trailer'),
        ('water_tanker', 'Water Tanker'),
        ('power_tiller', 'Power Tiller'),
        ('baler', 'Baler'),
        ('transplanter', 'Rice Transplanter'),
        ('other', 'Other'),
    )

    CONDITION_CHOICES = (
        ('excellent', 'Excellent'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor'),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='equipments'
    )

    name = models.CharField(max_length=200)

    equipment_type = models.CharField(
        max_length=50,
        choices=EQUIPMENT_TYPES
    )

    description = models.TextField(blank=True)

    hourly_rate = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    location = models.CharField(max_length=200)

    latitude = models.FloatField(
        null=True,
        blank=True
    )

    longitude = models.FloatField(
        null=True,
        blank=True
    )

    is_available = models.BooleanField(
        default=True
    )

    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        default='good'
    )

    last_service_date = models.DateField(
        null=True,
        blank=True
    )

    image = models.ImageField(
        upload_to='equipment_images/',
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    @property
    def average_rating(self):
        avg = self.reviews.aggregate(
            Avg("rating")
        )["rating__avg"]

        return round(avg, 1) if avg else 0

    @property
    def review_count(self):
        return self.reviews.count()

    def __str__(self):
        return self.name
    
class EquipmentImage(models.Model):
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name="images"
    )

    image = models.ImageField(
        upload_to="equipment_images/"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return (
            f"{self.equipment.name} - "
            f"Image {self.id}"
        )