
from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import HRContact
from .serializers import HRContactSerializer


class HRContactListView(generics.ListAPIView):
    serializer_class = HRContactSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return HRContact.objects.filter(
            is_active=True
        ).order_by("display_order", "id")
