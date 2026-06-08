from rest_framework import serializers
from .models import Booking
from equipment.models import EquipmentImage


class BookingSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(
        source='farmer.username',
        read_only=True
    )

    equipment_name = serializers.CharField(
        source='equipment.name',
        read_only=True
    )
    
    owner_name = serializers.CharField(
        source='equipment.owner.username',
        read_only=True
    )
    
    farmer_phone = serializers.CharField(
        source='farmer.phone_number',
        read_only=True
    )

    equipment_image = serializers.SerializerMethodField()
    
    is_owner = serializers.SerializerMethodField()
    is_farmer = serializers.SerializerMethodField()
    equipment_id = serializers.IntegerField(
        source='equipment.id',
        read_only=True
    )
    duration_hours = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context.get('request')
        return (
            obj.equipment.owner == request.user
            if request else False
        )

    def get_equipment_image(self, obj):
        first_image = obj.equipment.images.first()

        if first_image:
            request = self.context.get("request")

            if request:
                return request.build_absolute_uri(
                    first_image.image.url
                )

            return first_image.image.url

        return None
        
    def get_is_farmer(self, obj):
        request = self.context.get('request')
        return (
            obj.farmer == request.user
            if request else False
        )

    def get_duration_hours(self, obj):
        return round(obj.duration_hours, 2)

    def validate(self, data):
        equipment = data['equipment']
        start = data['start_time']
        end = data['end_time']

        if start >= end:
            raise serializers.ValidationError(
                "End time must be after start time"
            )

        overlapping = Booking.objects.filter(
            equipment=equipment,
            start_time__lt=end,
            end_time__gt=start
        ).exclude(
            status__in=['rejected']
        )

        if self.instance:
            overlapping = overlapping.exclude(
                pk=self.instance.pk
            )

        if overlapping.exists():
            raise serializers.ValidationError(
                "Equipment is already booked during this time period"
            )

        return data

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = [
            'farmer',
            'status',
            'total_price',
            'started_at',
            'completed_at',
            'returned_at',
            'equipment_id',
            'owner_name',
            'farmer_phone',
        ]