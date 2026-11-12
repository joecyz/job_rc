from datetime import datetime

from django.utils import timezone
from django.db.models import Q

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework import generics

from accounts.permissions import IsTeamEvent

from .models import (
    Event,
    EventCategory,
)

from .serializers import (
    EventCardSerializer,
    EventDetailSerializer,
    EventCategorySerializer,
)


# ======================================================
# Helper
# ======================================================

def get_event_datetime(date_value, time_value):
    """
    Menggabungkan DateField + TimeField menjadi datetime
    yang mengikuti timezone Django.
    """
    if not date_value or not time_value:
        return None

    naive_datetime = datetime.combine(
        date_value,
        time_value,
    )

    return timezone.make_aware(
        naive_datetime,
        timezone.get_current_timezone(),
    )


# ======================================================
# Public Event Landing
# ======================================================

class EventLandingView(APIView):
    permission_classes = [
        AllowAny,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    def get(self, request):
        now = timezone.localtime()

        events = (
            Event.objects
            .select_related("category")
        )

        ongoing_events = []
        upcoming_events = []
        past_events = []

        for event in events:
            start_datetime = get_event_datetime(
                event.start_date,
                event.start_time,
            )

            end_datetime = get_event_datetime(
                event.end_date,
                event.end_time,
            )

            # ==========================================
            # ONGOING
            # ==========================================

            if (
                start_datetime
                and end_datetime
                and start_datetime <= now <= end_datetime
            ):
                ongoing_events.append(event)

            # ==========================================
            # UPCOMING
            # ==========================================

            elif (
                start_datetime
                and start_datetime > now
            ):
                upcoming_events.append(event)

            # ==========================================
            # PAST
            # ==========================================

            elif (
                end_datetime
                and end_datetime < now
            ):
                past_events.append(event)

        # ==================================================
        # SORTING
        # ==================================================

        ongoing_events.sort(
            key=lambda event: (
                event.start_date,
                event.start_time,
            )
        )

        upcoming_events.sort(
            key=lambda event: (
                event.start_date,
                event.start_time,
            )
        )

        past_events.sort(
            key=lambda event: (
                event.end_date,
                event.end_time,
            ),
            reverse=True,
        )

        # ==================================================
        # RESPONSE
        # ==================================================

        return Response({
            "ongoing": EventCardSerializer(
                ongoing_events,
                many=True,
            ).data,

            "upcoming": EventCardSerializer(
                upcoming_events,
                many=True,
            ).data,

            "past": EventCardSerializer(
                past_events,
                many=True,
            ).data,
        })


# ======================================================
# Public Event List
# ======================================================

class EventListView(generics.ListAPIView):
    serializer_class = EventCardSerializer

    permission_classes = [
        AllowAny,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    def get_queryset(self):
        now = timezone.localtime()

        queryset = (
            Event.objects
            .select_related("category")
        )

        # ==================================================
        # SEARCH
        # ==================================================

        search = self.request.query_params.get("search")

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(description__icontains=search)
                | Q(city__icontains=search)
            )

        # ==================================================
        # CITY
        # ==================================================

        city = self.request.query_params.get("city")

        if city:
            queryset = queryset.filter(
                city__iexact=city
            )

        # ==================================================
        # CATEGORY
        # ==================================================

        category_id = self.request.query_params.get(
            "category"
        )

        if category_id:
            queryset = queryset.filter(
                category_id=category_id
            )

        # ==================================================
        # STATUS
        # ==================================================

        status = self.request.query_params.get("status")

        # --------------------------------------------------
        # UPCOMING
        # --------------------------------------------------

        if status == "upcoming":
            event_ids = []

            for event in queryset:
                start_datetime = get_event_datetime(
                    event.start_date,
                    event.start_time,
                )

                if (
                    start_datetime
                    and start_datetime > now
                ):
                    event_ids.append(event.id)

            queryset = queryset.filter(
                id__in=event_ids
            )

        # --------------------------------------------------
        # ONGOING
        # --------------------------------------------------

        elif status == "ongoing":
            event_ids = []

            for event in queryset:
                start_datetime = get_event_datetime(
                    event.start_date,
                    event.start_time,
                )

                end_datetime = get_event_datetime(
                    event.end_date,
                    event.end_time,
                )

                if (
                    start_datetime
                    and end_datetime
                    and start_datetime <= now <= end_datetime
                ):
                    event_ids.append(event.id)

            queryset = queryset.filter(
                id__in=event_ids
            )

        # --------------------------------------------------
        # PAST
        # --------------------------------------------------

        elif status == "past":
            event_ids = []

            for event in queryset:
                end_datetime = get_event_datetime(
                    event.end_date,
                    event.end_time,
                )

                if (
                    end_datetime
                    and end_datetime < now
                ):
                    event_ids.append(event.id)

            queryset = queryset.filter(
                id__in=event_ids
            )

        # ==================================================
        # SORT
        # ==================================================

        sort = self.request.query_params.get("sort")

        if sort == "newest":
            queryset = queryset.order_by(
                "-start_date",
                "-start_time",
            )

        elif sort == "oldest":
            queryset = queryset.order_by(
                "start_date",
                "start_time",
            )

        else:
            queryset = queryset.order_by(
                "start_date",
                "start_time",
            )

        return queryset


# ======================================================
# Public Event Detail
# ======================================================

class EventDetailView(generics.RetrieveAPIView):
    queryset = (
        Event.objects
        .select_related("category")
        .prefetch_related("galleries")
    )

    serializer_class = EventDetailSerializer

    permission_classes = [
        AllowAny,
    ]

    renderer_classes = [
        JSONRenderer,
    ]


# ======================================================
# Team Event - Event Category List
# ======================================================

class EventCategoryListView(generics.ListAPIView):
    serializer_class = EventCategorySerializer

    permission_classes = [
        IsAuthenticated,
        IsTeamEvent,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    queryset = EventCategory.objects.all()