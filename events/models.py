from django.db import models


# ======================================================
# Event Category
# ======================================================

class EventCategory(models.Model):

    category_name = models.CharField(
        max_length=100,
        unique=True
    )

    class Meta:
        db_table = "event_categories"
        ordering = ["id"]
        verbose_name = "Event Category"
        verbose_name_plural = "Event Categories"

    def __str__(self):
        return self.category_name


# ======================================================
# Event
# ======================================================

class Event(models.Model):

    title = models.CharField(
        max_length=200
    )

    description = models.TextField()

    article = models.TextField(
        blank=True,
        default=""
    )

    category = models.ForeignKey(
        EventCategory,
        on_delete=models.PROTECT,
        related_name="events"
    )

    city = models.CharField(
        max_length=100
    )

    location = models.CharField(
        max_length=255
    )

    start_date = models.DateField()

    end_date = models.DateField()

    start_time = models.TimeField()

    end_time = models.TimeField()

    poster = models.ImageField(
        upload_to="events/posters/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "events"
        ordering = ["-start_date"]
        verbose_name = "Event"
        verbose_name_plural = "Events"

    def __str__(self):
        return self.title


# ======================================================
# Event Gallery
# ======================================================

class EventGallery(models.Model):

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="galleries"
    )

    image = models.ImageField(
        upload_to="events/gallery/"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        db_table = "event_galleries"
        ordering = ["id"]
        verbose_name = "Event Gallery"
        verbose_name_plural = "Event Galleries"

    def __str__(self):
        return self.event.title