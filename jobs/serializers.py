from rest_framework import serializers

from applications.models import Application

from .models import (
    Region,
    Division,
    Position,
    EducationLevel,
    Job,
)


# ======================================================
# Region Serializer
# ======================================================

class RegionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Region

        fields = [
            "id",
            "region_name",
        ]


# ======================================================
# Division Serializer
# ======================================================

class DivisionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Division

        fields = [
            "id",
            "division_name",
        ]


# ======================================================
# Position Serializer
# ======================================================

class PositionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Position

        fields = [
            "id",
            "position_name",
        ]


# ======================================================
# Education Level Serializer
# ======================================================

class EducationLevelSerializer(serializers.ModelSerializer):

    class Meta:
        model = EducationLevel

        fields = [
            "id",
            "level_name",
        ]


# ======================================================
# Job Serializer
# ======================================================

class JobSerializer(serializers.ModelSerializer):

    division_name = serializers.CharField(
        source="division.division_name",
        read_only=True,
    )

    position_name = serializers.CharField(
        source="position.position_name",
        read_only=True,
    )

    region_name = serializers.CharField(
        source="region.region_name",
        read_only=True,
    )

    education_level_name = serializers.CharField(
        source="education_level.level_name",
        read_only=True,
    )

    has_applied = serializers.SerializerMethodField()

    is_full = serializers.SerializerMethodField()

    class Meta:
        model = Job

        fields = [
            "id",

            # Division
            "division",
            "division_name",

            # Position
            "position",
            "position_name",

            # Region
            "region",
            "region_name",

            # Education Level
            "education_level",
            "education_level_name",

            # Job information
            "description",
            "requirements",
            "quota",
            "open_date",
            "deadline",
            "status",

            # Timestamp
            "created_at",
            "updated_at",

            # Application information
            "has_applied",
            "is_full",
        ]

        read_only_fields = [
            "id",
            "division_name",
            "position_name",
            "region_name",
            "education_level_name",
            "created_at",
            "updated_at",
            "has_applied",
            "is_full",
        ]

    # ==================================================
    # Has Applied
    # ==================================================

    def get_has_applied(self, obj):

        request = self.context.get("request")

        if not request:
            return False

        if not request.user.is_authenticated:
            return False

        return Application.objects.filter(
            applicant=request.user,
            job=obj,
        ).exists()

    # ==================================================
    # Is Full
    # ==================================================

    def get_is_full(self, obj):

        application_count = Application.objects.filter(
            job=obj
        ).count()

        return application_count >= obj.quota


# ======================================================
# HR Job Update Serializer
# ======================================================

class HRJobUpdateSerializer(serializers.ModelSerializer):

    division_name = serializers.CharField(
        source="division.division_name",
        read_only=True,
    )

    position_name = serializers.CharField(
        source="position.position_name",
        read_only=True,
    )

    region_name = serializers.CharField(
        source="region.region_name",
        read_only=True,
    )

    education_level_name = serializers.CharField(
        source="education_level.level_name",
        read_only=True,
    )

    class Meta:
        model = Job

        fields = [
            "id",

            # Division
            "division",
            "division_name",

            # Position
            "position",
            "position_name",

            # Region
            "region",
            "region_name",

            # Education
            "education_level",
            "education_level_name",

            # Job information
            "description",
            "requirements",
            "quota",
            "open_date",
            "deadline",
            "status",

            # Timestamp
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",

            # Tidak boleh diubah HR
            "division",
            "position",
            "region",
            "education_level",
            "description",
            "requirements",

            # Display fields
            "division_name",
            "position_name",
            "region_name",
            "education_level_name",

            # Timestamp
            "created_at",
            "updated_at",
        ]

    # ==================================================
    # Validate Quota
    # ==================================================

    def validate_quota(self, value):

        application_count = Application.objects.filter(
            job=self.instance
        ).count()

        if value < application_count:
            raise serializers.ValidationError(
                f"Quota tidak boleh lebih kecil dari "
                f"jumlah applicant yang sudah melamar "
                f"({application_count} applicant)."
            )

        return value