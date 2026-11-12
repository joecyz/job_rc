from django.db import models


class HRContact(models.Model):
    region = models.CharField(
        max_length=100,
        verbose_name="Region"
    )

    department = models.CharField(
        max_length=100,
        default="HR Recruitment",
        verbose_name="Department"
    )

    phone = models.CharField(
        max_length=30,
        verbose_name="Phone Number"
    )

    description = models.CharField(
        max_length=150,
        default="Recruitment Hotline",
        verbose_name="Description"
    )

    display_order = models.PositiveIntegerField(
        default=0,
        verbose_name="Display Order"
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="Active"
    )

    class Meta:
        ordering = ["display_order", "id"]
        verbose_name = "HR Contact"
        verbose_name_plural = "HR Contacts"

    def __str__(self):
        return self.region
