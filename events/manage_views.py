from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import (
    JSONParser,
    MultiPartParser,
    FormParser,
)

from accounts.permissions import IsTeamEvent

from .models import (
    Event,
    EventGallery,
)

from .serializers import (
    EventManageSerializer,
    EventPosterSerializer,
    EventGallerySerializer,
)


# ======================================================
# TEAM EVENT - CREATE EVENT
# ======================================================

class EventCreateView(generics.CreateAPIView):

    queryset = Event.objects.all()

    serializer_class = EventManageSerializer

    permission_classes = [
        IsAuthenticated,
        IsTeamEvent,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]


# ======================================================
# TEAM EVENT - EVENT LIST
# ======================================================

class EventManageListView(generics.ListAPIView):

    serializer_class = EventManageSerializer

    permission_classes = [
        IsAuthenticated,
        IsTeamEvent,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    queryset = (
        Event.objects
        .select_related("category")
        .prefetch_related("galleries")
        .order_by(
            "start_date",
            "start_time",
        )
    )


# ======================================================
# TEAM EVENT - EVENT DETAIL
# ======================================================

class EventManageDetailView(generics.RetrieveAPIView):

    serializer_class = EventManageSerializer

    permission_classes = [
        IsAuthenticated,
        IsTeamEvent,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    queryset = (
        Event.objects
        .select_related("category")
        .prefetch_related("galleries")
    )


# ======================================================
# TEAM EVENT - UPDATE EVENT
# ======================================================

class EventUpdateView(generics.UpdateAPIView):

    queryset = Event.objects.all()

    serializer_class = EventManageSerializer

    permission_classes = [
        IsAuthenticated,
        IsTeamEvent,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    parser_classes = [
        JSONParser,
        MultiPartParser,
        FormParser,
    ]

    http_method_names = [
        "patch",
    ]


# ======================================================
# TEAM EVENT - DELETE EVENT
# ======================================================

class EventDeleteView(generics.DestroyAPIView):

    queryset = Event.objects.all()

    permission_classes = [
        IsAuthenticated,
        IsTeamEvent,
    ]

    renderer_classes = [
        JSONRenderer,
    ]


# ======================================================
# TEAM EVENT - UPLOAD POSTER
# ======================================================

class EventPosterUploadView(generics.UpdateAPIView):

    queryset = Event.objects.all()

    serializer_class = EventPosterSerializer

    permission_classes = [
        IsAuthenticated,
        IsTeamEvent,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    http_method_names = [
        "patch",
        "delete",
    ]

    def delete(self, request, *args, **kwargs):

        event = self.get_object()

        event.poster = None

        event.save(
            update_fields=[
                "poster",
            ]
        )

        return Response(
            {
                "detail": "Poster berhasil dihapus."
            },
            status=status.HTTP_200_OK,
        )


# ======================================================
# TEAM EVENT - UPLOAD GALLERY
# ======================================================

class EventGalleryUploadView(generics.CreateAPIView):

    serializer_class = EventGallerySerializer

    permission_classes = [
        IsAuthenticated,
        IsTeamEvent,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def create(
        self,
        request,
        *args,
        **kwargs
    ):

        event = get_object_or_404(
            Event,
            pk=self.kwargs["pk"],
        )

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save(
            event=event,
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )


# ======================================================
# TEAM EVENT - DELETE GALLERY
# ======================================================


class EventGalleryDeleteView(
    generics.DestroyAPIView
):

    queryset = EventGallery.objects.all()

    permission_classes = [
        IsAuthenticated,
        IsTeamEvent,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    def perform_destroy(self, instance):

        # Hapus file gambar dari media storage
        if instance.image:
            instance.image.delete(save=False)

        # Hapus record dari database
        instance.delete()
