
from django.urls import path
from .views import HRContactListView

urlpatterns = [
    path("", HRContactListView.as_view(), name="hr-contact-list"),
]
