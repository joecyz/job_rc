from django.contrib import admin
from .models import HRContact


@admin.register(HRContact)
class HRContactAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "region",
        "department",
        "phone",
        "display_order",
        "is_active",
    )

    list_display_links = ("region",)

    list_editable = (
        "display_order",
        "is_active",
    )

    search_fields = (
        "region",
        "department",
        "phone",
    )

    list_filter = (
        "is_active",
        "region",
    )

    ordering = ("display_order", "id")
