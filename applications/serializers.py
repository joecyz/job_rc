from rest_framework import serializers

from .models import Application


# ======================================================
# Applicant - Application
# ======================================================

class ApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(
        source="job.position.position_name",
        read_only=True,
    )

    division_name = serializers.CharField(
        source="job.division.division_name",
        read_only=True,
    )

    region_name = serializers.CharField(
        source="job.region.region_name",
        read_only=True,
    )

    class Meta:
        model = Application

        fields = [
            "id",
            "job",
            "job_title",
            "division_name",
            "region_name",
            "status",
            "hr_notes",
            "applied_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "hr_notes",
            "applied_at",
        ]


# ======================================================
# HR - Application List
# ======================================================

# ======================================================
# HR - Application List
# ======================================================

class HRApplicationSerializer(serializers.ModelSerializer):

    applicant_name = serializers.CharField(
        source="applicant.profile.full_name",
        read_only=True,
    )

    applicant_email = serializers.EmailField(
        source="applicant.email",
        read_only=True,
    )

    applicant_phone = serializers.CharField(
        source="applicant.profile.phone",
        read_only=True,
    )

    profile_photo = serializers.SerializerMethodField()

    job_title = serializers.CharField(
        source="job.position.position_name",
        read_only=True,
    )

    division_name = serializers.CharField(
        source="job.division.division_name",
        read_only=True,
    )

    region_name = serializers.CharField(
        source="job.region.region_name",
        read_only=True,
    )

    job_deadline = serializers.DateField(
        source="job.deadline",
        read_only=True,
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "applicant",
            "applicant_name",
            "applicant_email",
            "applicant_phone",
            "profile_photo",
            "job",
            "job_title",
            "division_name",
            "region_name",
            "job_deadline",
            "status",
            "hr_notes",
            "applied_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "applicant",
            "job",
            "applicant_name",
            "applicant_email",
            "applicant_phone",
            "profile_photo",
            "job_title",
            "division_name",
            "region_name",
            "applied_at",
            "updated_at",
        ]

    def get_profile_photo(self, obj):
        profile = getattr(
            obj.applicant,
            "profile",
            None,
        )

        if not profile or not profile.profile_photo:
            return None

        request = self.context.get("request")

        profile_photo = profile.profile_photo.url

        if request:
            profile_photo = request.build_absolute_uri(
                profile_photo
            )

        return profile_photo


# ======================================================
# HR - Applicant Detail
# ======================================================

class HRApplicantDetailSerializer(serializers.ModelSerializer):

    # --------------------------------------------------
    # Applicant basic data
    # --------------------------------------------------

    applicant_name = serializers.CharField(
        source="applicant.profile.full_name",
        read_only=True,
    )

    applicant_email = serializers.EmailField(
        source="applicant.email",
        read_only=True,
    )

    applicant_phone = serializers.CharField(
        source="applicant.profile.phone",
        read_only=True,
    )

    # --------------------------------------------------
    # Profile
    # --------------------------------------------------

    profile = serializers.SerializerMethodField()

    # --------------------------------------------------
    # Education
    # --------------------------------------------------

    education = serializers.SerializerMethodField()

    # --------------------------------------------------
    # Documents
    # --------------------------------------------------

    documents = serializers.SerializerMethodField()

    # --------------------------------------------------
    # Job
    # --------------------------------------------------

    job_title = serializers.CharField(
        source="job.position.position_name",
        read_only=True,
    )

    division_name = serializers.CharField(
        source="job.division.division_name",
        read_only=True,
    )

    region_name = serializers.CharField(
        source="job.region.region_name",
        read_only=True,
    )

    class Meta:
        model = Application

        fields = [
            "id",

            "applicant",
            "applicant_name",
            "applicant_email",
            "applicant_phone",

            "profile",
            "education",
            "documents",

            "job",
            "job_title",
            "division_name",
            "region_name",

            "status",
            "hr_notes",
            "applied_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",

            "applicant",
            "applicant_name",
            "applicant_email",
            "applicant_phone",

            "profile",
            "education",
            "documents",

            "job",
            "job_title",
            "division_name",
            "region_name",

            "applied_at",
            "updated_at",
        ]

    # ==================================================
    # PROFILE
    # ==================================================

    def get_profile(self, obj):

        profile = getattr(
            obj.applicant,
            "profile",
            None,
        )

        if not profile:
            return None

        request = self.context.get("request")

        profile_photo = None

        if profile.profile_photo:
            profile_photo = profile.profile_photo.url

            if request:
                profile_photo = request.build_absolute_uri(
                    profile_photo
                )

        return {
            "full_name": profile.full_name,
            "birth_place": profile.birth_place,
            "birth_date": profile.birth_date,
            "gender": profile.gender,
            "phone": profile.phone,
            "nik": profile.nik,
            "profile_photo": profile_photo,
        }

    # ==================================================
    # EDUCATION
    # ==================================================

    def get_education(self, obj):

        education = getattr(
            obj.applicant,
            "education",
            None,
        )

        if not education:
            return None

        return {
            "education_level": education.education_level,
            "school_name": education.school_name,
            "major": education.major,
            "entry_year": education.entry_year,
            "graduation_year": education.graduation_year,
        }

    # ==================================================
    # DOCUMENTS
    # ==================================================

    def get_documents(self, obj):

        document = getattr(
            obj.applicant,
            "document",
            None,
        )

        if not document:
            return None

        request = self.context.get("request")

        cv_file = None
        ktp_file = None
        kk_file = None

        if document.cv_file:
            cv_file = document.cv_file.url

            if request:
                cv_file = request.build_absolute_uri(
                    cv_file
                )

        if document.ktp_file:
            ktp_file = document.ktp_file.url

            if request:
                ktp_file = request.build_absolute_uri(
                    ktp_file
                )

        if document.kk_file:
            kk_file = document.kk_file.url

            if request:
                kk_file = request.build_absolute_uri(
                    kk_file
                )

        return {
            "cv_file": cv_file,
            "ktp_file": ktp_file,
            "kk_file": kk_file,
        }
        
        