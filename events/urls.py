from django.urls import path

from .views import (
    EventLandingView,
    EventListView,
    EventDetailView,
    EventCategoryListView,
)

from .manage_views import (
    EventCreateView,
    EventManageListView,
    EventUpdateView,
    EventDeleteView,
    EventPosterUploadView,
    EventGalleryUploadView,
    EventGalleryDeleteView,
)


urlpatterns = [

    # ======================================================
    # PUBLIC
    # ======================================================

    path(
        "",
        EventLandingView.as_view(),
        name="event-landing",
    ),

    path(
        "all/",
        EventListView.as_view(),
        name="event-list",
    ),

    path(
        "<int:pk>/",
        EventDetailView.as_view(),
        name="event-detail",
    ),

    # ======================================================
    # TEAM EVENT
    # ======================================================

    path(
        "categories/",
        EventCategoryListView.as_view(),
        name="event-category-list",
    ),

    path(
        "manage/",
        EventCreateView.as_view(),
        name="event-create",
    ),

    path(
        "manage/list/",
        EventManageListView.as_view(),
        name="event-manage-list",
    ),

    path(
        "manage/<int:pk>/",
        EventUpdateView.as_view(),
        name="event-update",
    ),

    path(
        "manage/<int:pk>/poster/",
        EventPosterUploadView.as_view(),
        name="event-poster-upload",
    ),

    path(
        "manage/<int:pk>/gallery/",
        EventGalleryUploadView.as_view(),
        name="event-gallery-upload",
    ),

    path(
        "gallery/<int:pk>/delete/",
        EventGalleryDeleteView.as_view(),
        name="event-gallery-delete",
    ),

    path(
        "manage/<int:pk>/delete/",
        EventDeleteView.as_view(),
        name="event-delete",
    ),
]