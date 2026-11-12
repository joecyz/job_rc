from django.db import models
from django.core.exceptions import ValidationError


# ======================================================
# Choices
# ======================================================

class JobStatus(models.TextChoices):
    OPEN = "OPEN", "Open"
    CLOSED = "CLOSED", "Closed"


# ======================================================
# Region
# ======================================================

class Region(models.Model):
    region_name = models.CharField(
        max_length=100,
        unique=True
    )

    class Meta:
        db_table = "regions"
        ordering = ["id"]
        verbose_name = "Region"
        verbose_name_plural = "Regions"

    def __str__(self):
        return self.region_name


# ======================================================
# Division
# ======================================================

class Division(models.Model):
    division_name = models.CharField(
        max_length=100,
        unique=True
    )

    class Meta:
        db_table = "divisions"
        ordering = ["id"]
        verbose_name = "Division"
        verbose_name_plural = "Divisions"

    def __str__(self):
        return self.division_name


# ======================================================
# Position
# ======================================================

class Position(models.Model):
    position_name = models.CharField(
        max_length=100,
        unique=True
    )

    class Meta:
        db_table = "positions"
        ordering = ["id"]
        verbose_name = "Position"
        verbose_name_plural = "Positions"

    def __str__(self):
        return self.position_name


# ======================================================
# Education Level
# ======================================================

class EducationLevel(models.Model):
    level_name = models.CharField(
        max_length=100,
        unique=True
    )

    class Meta:
        db_table = "education_levels"
        ordering = ["id"]
        verbose_name = "Education Level"
        verbose_name_plural = "Education Levels"

    def __str__(self):
        return self.level_name


# ======================================================
# Job
# ======================================================

class Job(models.Model):
    division = models.ForeignKey(
        Division,
        on_delete=models.PROTECT,
        related_name="jobs"
    )

    position = models.ForeignKey(
        Position,
        on_delete=models.PROTECT,
        related_name="jobs"
    )

    region = models.ForeignKey(
        Region,
        on_delete=models.PROTECT,
        related_name="jobs"
    )

    education_level = models.ForeignKey(
        EducationLevel,
        on_delete=models.PROTECT,
        related_name="jobs",
        null=True,
        blank=True,
    )

    description = models.TextField()

    requirements = models.TextField()

    quota = models.PositiveSmallIntegerField()

    open_date = models.DateField()

    deadline = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=JobStatus.choices,
        default=JobStatus.OPEN
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        db_table = "jobs"
        ordering = ["-created_at"]
        verbose_name = "Job"
        verbose_name_plural = "Jobs"

    def clean(self):
        if self.deadline < self.open_date:
            raise ValidationError(
                "Deadline cannot be earlier than open date."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return (
            f"{self.position.position_name} - "
            f"{self.region.region_name}"
        )