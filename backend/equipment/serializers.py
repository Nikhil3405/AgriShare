from rest_framework import serializers
from .models import Equipment, EquipmentImage

class EquipmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentImage
        fields = ["id", "image"]
        
class EquipmentSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(
        source="owner.username",
        read_only=True
    )

    owner_id = serializers.IntegerField(
        source="owner.id",
        read_only=True
    )
    images = EquipmentImageSerializer(
        many=True,
        read_only=True
    )
    owner_phone = serializers.CharField(
        source="owner.phone_number",
        read_only=True
    )

    owner_village = serializers.CharField(
        source="owner.village",
        read_only=True
    )
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()

    class Meta:
        model = Equipment
        fields = "__all__"

        read_only_fields = [
            "owner",
            "average_rating",
            "review_count",
        ]