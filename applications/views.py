from django.utils import timezone
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.exceptions import ValidationError
from accounts.models import Profile, Education, Document
from .models import Application

from .serializers import (
    ApplicationSerializer,
    HRApplicationSerializer,
    HRApplicantDetailSerializer,
)

from accounts.permissions import (
    IsApplicant,
    IsHR,
)


# ======================================================
# CREATE APPLICATION
# ======================================================

class ApplicationCreateView(generics.CreateAPIView):

    serializer_class = ApplicationSerializer

    permission_classes = [
        IsApplicant,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    def perform_create(self, serializer):

        job = serializer.validated_data["job"]
        
                # ----------------------------------------------
        # PROFILE COMPLETION
        # ----------------------------------------------

        user = self.request.user

        profile = Profile.objects.filter(
            user=user
        ).first()

        education = Education.objects.filter(
            user=user
        ).first()

        document = Document.objects.filter(
            user=user
        ).first()

        profile_complete = (
            profile is not None
            and bool(profile.full_name)
            and bool(profile.birth_place)
            and bool(profile.birth_date)
            and bool(profile.gender)
            and bool(profile.phone)
            and bool(profile.nik)
        )

        education_complete = (
            education is not None
            and bool(education.education_level)
            and bool(education.school_name)
            and bool(education.major)
            and bool(education.entry_year)
            and bool(education.graduation_year)
        )

        document_complete = (
            document is not None
            and bool(document.cv_file)
            and bool(document.ktp_file)
            and bool(document.kk_file)
        )

        if not profile_complete:
            raise ValidationError({
                "detail":
                    "Lengkapi Profile terlebih dahulu."
            })

        if not education_complete:
            raise ValidationError({
                "detail":
                    "Lengkapi Education terlebih dahulu."
            })

        if not document_complete:
            raise ValidationError({
                "detail":
                    "Lengkapi Documents terlebih dahulu."
            })

        # ----------------------------------------------
        # Job status
        # ----------------------------------------------

        if job.status != "OPEN":

            raise ValidationError({
                "detail": "This job is closed."
            })

        # ----------------------------------------------
        # Deadline
        # ----------------------------------------------

        today = timezone.now().date()

        if job.deadline < today:

            raise ValidationError({
                "detail": "Application deadline has passed."
            })

        # ----------------------------------------------
        # Quota
        # ----------------------------------------------

        if (
            Application.objects
            .filter(job=job)
            .count()
            >= job.quota
        ):

            raise ValidationError({
                "detail": "Job quota has been reached."
            })

        # ----------------------------------------------
        # Duplicate application
        # ----------------------------------------------

        if Application.objects.filter(
            applicant=self.request.user,
            job=job,
        ).exists():

            raise ValidationError({
                "detail":
                    "You have already applied for this job."
            })

        # ----------------------------------------------
        # Save
        # ----------------------------------------------

        serializer.save(
            applicant=self.request.user
        )


# ======================================================
# MY APPLICATIONS
# ======================================================

class MyApplicationListView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [
        IsApplicant,
    ]
    renderer_classes = [
        JSONRenderer,
    ]
    pagination_class = None

    def get_queryset(self):

        return (
            Application.objects
            .filter(
                applicant=self.request.user
            )
            .select_related(
                "job",
                "job__division",
                "job__position",
                "job__region",
            )
        )


# ======================================================
# HR APPLICATION LIST
# ======================================================

class HRApplicationListView(generics.ListAPIView):

    serializer_class = HRApplicationSerializer

    permission_classes = [
        IsHR,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    queryset = (
        Application.objects
        .select_related(
            "applicant",
            "applicant__profile",
            "applicant__education",
            "applicant__document",

            "job",
            "job__division",
            "job__position",
            "job__region",
        )
    )


# ======================================================
# HR Dashboard Statistics
# ======================================================

class HRDashboardStatsView(APIView):

    permission_classes = [
        IsHR,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    def get(self, request):

        total_applicants = (
            Application.objects
            .values("applicant_id")
            .distinct()
            .count()
        )

        return Response({
            "total_applicants": total_applicants,
        })

# ======================================================
# HR APPLICATION DETAIL
# ======================================================

class HRApplicationDetailView(generics.RetrieveUpdateAPIView):

    queryset = (
        Application.objects
        .select_related(
            "applicant",
            "applicant__profile",
            "applicant__education",
            "applicant__document",
            "job",
            "job__division",
            "job__position",
            "job__region",
        )
    )

    serializer_class = HRApplicantDetailSerializer

    permission_classes = [
        IsHR,
    ]

    renderer_classes = [
        JSONRenderer,
    ]

    http_method_names = [
        "get",
        "patch",
    ]