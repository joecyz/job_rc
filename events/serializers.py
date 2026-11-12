from rest_framework import serializers

from .models import (
    Event,
    EventGallery,
    EventCategory,
)


# ======================================================
# Event Gallery
# ======================================================

class EventGallerySerializer(serializers.ModelSerializer):

    image = serializers.ImageField(
        use_url=True
    )

    class Meta:

        model = EventGallery

        fields = (
            "id",
            "image",
            "uploaded_at",
        )

        read_only_fields = (
            "id",
            "uploaded_at",
        )


# ======================================================
# Event Card
# ======================================================

class EventCardSerializer(serializers.ModelSerializer):

    category = serializers.CharField(
        source="category.category_name",
        read_only=True,
    )

    class Meta:

        model = Event

        fields = (
            "id",
            "title",
            "category",
            "city",
            "location",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "poster",
        )


# ======================================================
# Event Detail
# ======================================================

class EventDetailSerializer(serializers.ModelSerializer):

    category = serializers.CharField(
        source="category.category_name",
        read_only=True,
    )

    gallery = EventGallerySerializer(
        source="galleries",
        many=True,
        read_only=True,
    )

    class Meta:

        model = Event

        fields = (
            "id",
            "title",
            "description",
            "article",
            "category",
            "city",
            "location",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "poster",
            "gallery",
        )


# ======================================================
# Team Event Create / Update
# ======================================================


class EventManageSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.category_name",
        read_only=True,
    )

    galleries = EventGallerySerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Event
        fields = (
            "id",
            "title",
            "description",
            "article",
            "category",
            "category_name",
            "city",
            "location",
            "start_date",
            "end_date",
            "start_time",
            "end_time",
            "poster",
            "galleries",
        )



# ======================================================
# Upload Poster
# ======================================================

class EventPosterSerializer(serializers.ModelSerializer):

    class Meta:

        model = Event

        fields = (
            "poster",
        )

class EventCategorySerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = EventCategory

        fields = (
            "id",
            "category_name",
        )

