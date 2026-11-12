from django.urls import path

from .views import (
    ApplicationCreateView,
    MyApplicationListView,
    HRApplicationListView,
    HRDashboardStatsView,
    HRApplicationDetailView,
)


urlpatterns = [

    # ==================================================
    # APPLICANT
    # ==================================================

    path(
        "create/",
        ApplicationCreateView.as_view(),
        name="application-create",
    ),

    path(
        "my/",
        MyApplicationListView.as_view(),
        name="my-applications",
    ),


    # ==================================================
    # HR
    # ==================================================

    path(
        "hr/",
        HRApplicationListView.as_view(),
        name="hr-applications",
    ),
    
     path(
            "hr/stats/",
            HRDashboardStatsView.as_view(),
            name="hr-dashboard-stats",
        ),

    path(
        "hr/<int:pk>/",
        HRApplicationDetailView.as_view(),
        name="hr-application-detail",
    ),
    
]