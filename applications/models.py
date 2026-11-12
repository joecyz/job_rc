from django.db import models

from accounts.models import User
from jobs.models import Job


# ======================================================
# Application Status
# ======================================================

class ApplicationStatus(models.TextChoices):
    APPLIED = "APPLIED", "Applied"
    SCREENING = "SCREENING", "Screening"
    INTERVIEW = "INTERVIEW", "Interview"
    ACCEPTED = "ACCEPTED", "Accepted"
    REJECTED = "REJECTED", "Rejected"


# ======================================================
# Application
# ======================================================

class Application(models.Model):

    applicant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications",
    )

    status = models.CharField(
        max_length=20,
        choices=ApplicationStatus.choices,
        default=ApplicationStatus.APPLIED,
    )

    hr_notes = models.TextField(
        blank=True,
    )

    applied_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        db_table = "applications"

        ordering = [
            "-applied_at",
        ]

        verbose_name = "Application"

        verbose_name_plural = "Applications"

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "applicant",
                    "job",
                ],
                name="unique_application",
            )
        ]

    def __str__(self):
        return (
            f"{self.applicant.username} - "
            f"{self.job.position.position_name}"
        )