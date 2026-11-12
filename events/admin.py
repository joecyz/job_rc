from django.contrib import admin
from .models import (
    EventCategory,
    Event,
    EventGallery,
)


# ======================================================
# Event Category
# ======================================================

@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "category_name",
    )

    search_fields = (
        "category_name",
    )


# ======================================================
# Event
# ======================================================

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "title",
        "category",
        "city",
        "start_date",
        "end_date",
    )

    list_filter = (
        "category",
        "city",
    )

    search_fields = (
        "title",
        "city",
    )


# ======================================================
# Event Gallery
# ======================================================

@admin.register(EventGallery)
class EventGalleryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "event",
        "uploaded_at",
    )

    search_fields = (
        "event__title",
    )