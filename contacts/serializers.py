
from rest_framework import serializers
from .models import HRContact


class HRContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = HRContact
        fields = [
            "id",
            "region",
            "department",
            "phone",
            "description",
            "display_order",
        ]
