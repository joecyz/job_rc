from django.urls import path

from .views import (
    RegionListView,
    DivisionListView,
    PositionListView,
    EducationLevelListView,
    JobListCreateView,
    JobDetailView,
)


urlpatterns = [

    # ==================================================
    # Job
    # ==================================================

    path(
        "",
        JobListCreateView.as_view(),
        name="job-list-create",
    ),

    path(
        "<int:pk>/",
        JobDetailView.as_view(),
        name="job-detail",
    ),

    # ==================================================
    # Master Data
    # ==================================================

    path(
        "regions/",
        RegionListView.as_view(),
        name="region-list",
    ),

    path(
        "divisions/",
        DivisionListView.as_view(),
        name="division-list",
    ),

    path(
        "positions/",
        PositionListView.as_view(),
        name="position-list",
    ),

    path(
        "education-levels/",
        EducationLevelListView.as_view(),
        name="education-level-list",
    ),
]