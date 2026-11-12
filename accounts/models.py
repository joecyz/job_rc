from django.db import models
from django.contrib.auth.models import AbstractUser


# ======================================================
# Choices
# ======================================================

class GenderChoices(models.TextChoices):
    MALE = "Male", "Male"
    FEMALE = "Female", "Female"


class EducationLevel(models.TextChoices):
    SD = "SD", "SD"
    SMP = "SMP", "SMP"
    SMA = "SMA/SMK", "SMA/SMK"
    D1 = "D1", "D1"
    D2 = "D2", "D2"
    D3 = "D3", "D3"
    D4 = "D4", "D4"
    S1 = "S1", "S1"
    S2 = "S2", "S2"
    S3 = "S3", "S3"


# ======================================================
# Role
# ======================================================

class Role(models.Model):

    role_name = models.CharField(
        max_length=50,
        unique=True
    )

    class Meta:
        db_table = "roles"
        ordering = ["id"]
        verbose_name = "Role"
        verbose_name_plural = "Roles"

    def __str__(self):
        return self.role_name


# ======================================================
# User
# ======================================================

class User(AbstractUser):
    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        related_name="users",
        null=True,
        blank=True,
    )

    email = models.EmailField()

    class Meta:
        db_table = "users"
        ordering = ["id"]
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return self.username


# ======================================================
# Profile
# ======================================================

class Profile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    full_name = models.CharField(
        max_length=255
    )

    birth_place = models.CharField(
        max_length=100
    )

    birth_date = models.DateField()

    gender = models.CharField(
        max_length=10,
        choices=GenderChoices.choices,
    )

    phone = models.CharField(
        max_length=20
    )

    nik = models.CharField(
        max_length=30,
        unique=True,
    )

    profile_photo = models.ImageField(
        upload_to="profile/",
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "profiles"
        ordering = ["id"]
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"

    def __str__(self):
        return self.full_name


# ======================================================
# Education
# ======================================================

class Education(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="education",
    )

    education_level = models.CharField(
        max_length=10,
        choices=EducationLevel.choices,
    )

    school_name = models.CharField(
        max_length=255
    )

    major = models.CharField(
        max_length=100
    )

    entry_year = models.PositiveSmallIntegerField()

    graduation_year = models.PositiveSmallIntegerField()

    class Meta:
        db_table = "educations"
        ordering = ["id"]
        verbose_name = "Education"
        verbose_name_plural = "Educations"

    def __str__(self):
        return self.school_name


# ======================================================
# Document
# ======================================================

class Document(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="document",
    )

    cv_file = models.FileField(
        upload_to="documents/cv/"
    )

    ktp_file = models.FileField(
        upload_to="documents/ktp/"
    )

    kk_file = models.FileField(
        upload_to="documents/kk/"
    )

    class Meta:
        db_table = "documents"
        ordering = ["id"]
        verbose_name = "Document"
        verbose_name_plural = "Documents"

    def __str__(self):
        return f"{self.user.username} Documents"