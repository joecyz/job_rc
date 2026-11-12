from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import User, Profile, Education, Document
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from django.core.files.storage import default_storage
from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
    EducationSerializer,
    DocumentSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    renderer_classes = [JSONRenderer]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    renderer_classes = [JSONRenderer]

    def get_object(self):
        return Profile.objects.filter(user=self.request.user).first()

    # ==========================
    # GET PROFILE
    # ==========================
    def get(self, request, *args, **kwargs):
        profile = self.get_object()

        if profile is None:
            return Response(
                {"detail": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    # ==========================
    # CREATE PROFILE
    # ==========================
    def post(self, request, *args, **kwargs):
        if self.get_object() is not None:
            return Response(
                {"detail": "Profile already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ==========================
    # UPDATE PROFILE
    # ==========================
    def put(self, request, *args, **kwargs):
        profile = self.get_object()

        if profile is None:
            return Response(
                {"detail": "Profile not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            profile,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
        
class EducationView(generics.RetrieveUpdateAPIView):
    serializer_class = EducationSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    renderer_classes = [JSONRenderer]

    def get_object(self):
        return Education.objects.filter(user=self.request.user).first()

    def get(self, request, *args, **kwargs):
        education = self.get_object()

        if education is None:
            return Response(
                {"detail": "Education not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(education)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        if self.get_object() is not None:
            return Response(
                {"detail": "Education already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, *args, **kwargs):
        education = self.get_object()

        if education is None:
            return Response(
                {"detail": "Education not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            education,
            data=request.data,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
        
class DocumentView(generics.RetrieveUpdateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    renderer_classes = [JSONRenderer]

    parser_classes = [
        MultiPartParser,
        FormParser,
    ]

    def get_object(self):
        return Document.objects.filter(user=self.request.user).first()

    def get(self, request, *args, **kwargs):
        document = self.get_object()

        if document is None:
            return Response(
                {"detail": "Document not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(document)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        if self.get_object() is not None:
            return Response(
                {"detail": "Document already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    def put(self, request, *args, **kwargs):
        document = self.get_object()

        if document is None:
            return Response(
                {"detail": "Document not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(
            document,
            data=request.data,
            partial=True,
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
        


class CustomTokenObtainPairView(
    TokenObtainPairView
):
    serializer_class = CustomTokenObtainPairSerializer