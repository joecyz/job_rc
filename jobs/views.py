from django.db.models import Q
from django.utils import timezone

from rest_framework import generics
from rest_framework.renderers import JSONRenderer
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny,
)

from accounts.permissions import IsHR

from .models import (
    Region,
    Division,
    Position,
    EducationLevel,
    Job,
    JobStatus,
)

from .serializers import (
    RegionSerializer,
    DivisionSerializer,
    PositionSerializer,
    EducationLevelSerializer,
    JobSerializer,
    HRJobUpdateSerializer,
)


# ======================================================
# Region
# ======================================================

class RegionListView(generics.ListAPIView):

    queryset = Region.objects.all()

    serializer_class = RegionSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    renderer_classes = [
        JSONRenderer,
    ]


# ======================================================
# Division
# ======================================================

class DivisionListView(generics.ListAPIView):

    queryset = Division.objects.all()

    serializer_class = DivisionSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    renderer_classes = [
        JSONRenderer,
    ]


# ======================================================
# Position
# ======================================================

class PositionListView(generics.ListAPIView):

    queryset = Position.objects.all()

    serializer_class = PositionSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    renderer_classes = [
        JSONRenderer,
    ]


# ======================================================
# Education Level
# ======================================================

class EducationLevelListView(generics.ListAPIView):

    queryset = EducationLevel.objects.all()

    serializer_class = EducationLevelSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    renderer_classes = [
        JSONRenderer,
    ]


# ======================================================
# Job List / Create
# ======================================================

class JobListCreateView(generics.ListCreateAPIView):

    serializer_class = JobSerializer

    pagination_class = None

    renderer_classes = [
        JSONRenderer,
    ]

    # ==================================================
    # Permissions
    # ==================================================

    def get_permissions(self):

        if self.request.method == "GET":
            return [
                AllowAny(),
            ]

        return [
            IsAuthenticated(),
            IsHR(),
        ]

    # ==================================================
    # Queryset
    # ==================================================

    def get_queryset(self):

        queryset = (
            Job.objects
            .select_related(
                "division",
                "position",
                "region",
                "education_level",
            )
        )

        today = timezone.now().date()

        # ==================================================
        # Public / Non-HR
        # ==================================================

        if not self.request.user.is_authenticated:

            queryset = queryset.filter(
                status=JobStatus.OPEN,
                deadline__gte=today,
            )

        elif (
            self.request.user.role
            and self.request.user.role.role_name != "HR"
        ):

            queryset = queryset.filter(
                status=JobStatus.OPEN,
                deadline__gte=today,
            )

        # ==================================================
        # Query Parameters
        # ==================================================

        search = self.request.query_params.get(
            "search"
        )

        region = self.request.query_params.get(
            "region"
        )

        division = self.request.query_params.get(
            "division"
        )

        position = self.request.query_params.get(
            "position"
        )

        education_level = self.request.query_params.get(
            "education_level"
        )

        status = self.request.query_params.get(
            "status"
        )

        sort = self.request.query_params.get(
            "sort"
        )

        # ==================================================
        # Search
        # ==================================================

        if search:

            queryset = queryset.filter(
                Q(
                    position__position_name__icontains=search
                )
                |
                Q(
                    description__icontains=search
                )
                |
                Q(
                    region__region_name__icontains=search
                )
                |
                Q(
                    division__division_name__icontains=search
                )
                |
                Q(
                    education_level__level_name__icontains=search
                )
            )

        # ==================================================
        # Region Filter
        # ==================================================

        if region:

            queryset = queryset.filter(
                region__region_name__iexact=region
            )

        # ==================================================
        # Division Filter
        # ==================================================

        if division:

            queryset = queryset.filter(
                division__division_name__iexact=division
            )

        # ==================================================
        # Position Filter
        # ==================================================

        if position:

            queryset = queryset.filter(
                position__position_name__iexact=position
            )

        # ==================================================
        # Education Level Filter
        # ==================================================

        if education_level:

            queryset = queryset.filter(
                education_level__level_name__iexact=
                education_level
            )

        # ==================================================
        # HR Status Filter
        # ==================================================

        if (
            self.request.user.is_authenticated
            and status
            and self.request.user.role
            and self.request.user.role.role_name == "HR"
        ):

            queryset = queryset.filter(
                status=status.upper()
            )

        # ==================================================
        # Sorting
        # ==================================================

        if sort == "oldest":

            queryset = queryset.order_by(
                "created_at"
            )

        else:

            queryset = queryset.order_by(
                "-created_at"
            )

        return queryset


# ======================================================
# Job Detail / Update / Delete
# ======================================================

class JobDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = (
        Job.objects
        .select_related(
            "division",
            "position",
            "region",
            "education_level",
        )
    )

    renderer_classes = [
        JSONRenderer,
    ]

    # ==================================================
    # Serializer
    # ==================================================

    def get_serializer_class(self):

        if self.request.method == "PATCH":

            return HRJobUpdateSerializer

        return JobSerializer

    # ==================================================
    # Permissions
    # ==================================================

    def get_permissions(self):

        if self.request.method == "GET":

            return [
                AllowAny(),
            ]

        return [
            IsAuthenticated(),
            IsHR(),
        ]