from django.db.models import Q
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.renderers import JSONRenderer
from .models import FAQ
from .serializers import FAQSerializer

class FAQListView(generics.ListAPIView):

    serializer_class = FAQSerializer

    permission_classes = [
        AllowAny,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    def get_queryset(self):

        queryset = FAQ.objects.filter(
            is_active=True
        )

        search = self.request.query_params.get(
            "search"
        )

        if search:

            queryset = queryset.filter(
                Q(question__icontains=search)
                |
                Q(answer__icontains=search)
            )

        return queryset.order_by("id")