from django.contrib import admin
from .models import Region, Division, Position, Job


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("id", "region_name")
    search_fields = ("region_name",)


@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    list_display = ("id", "division_name")
    search_fields = ("division_name",)


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ("id", "position_name")
    search_fields = ("position_name",)


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "position",
        "division",
        "region",
        "quota",
        "deadline",
        "status",
    )

    list_filter = (
        "status",
        "division",
        "region",
    )

    search_fields = (
        "position__position_name",
    )