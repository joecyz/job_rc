from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import (
    RegisterView,
    ProfileView,
    EducationView,
    DocumentView,
    CustomTokenObtainPairView,
)

urlpatterns = [

    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),

    path(
        "login/",
        CustomTokenObtainPairView.as_view(),
        name="login",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="refresh",
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),

    path(
        "education/",
        EducationView.as_view(),
        name="education",
    ),

    path(
        "document/",
        DocumentView.as_view(),
        name="document",
    ),

]