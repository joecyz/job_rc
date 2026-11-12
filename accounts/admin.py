
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Role, User, Profile, Education, Document


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ("id", "role_name")
    search_fields = ("role_name",)


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "role",
        "is_staff",
        "is_active",
    )

    list_filter = (
        "role",
        "is_staff",
        "is_active",
    )

    search_fields = ("username", "email")
    ordering = ("id",)

    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Company Access", {
            "fields": ("role",),
        }),
    )

    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        ("Company Access", {
            "fields": ("role",),
        }),
    )


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "phone", "gender")
    search_fields = ("full_name", "phone")


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "education_level",
        "school_name",
        "major",
    )
    search_fields = ("school_name", "major")


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("id", "user")
