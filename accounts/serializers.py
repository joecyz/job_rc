from rest_framework import serializers

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer
)

from .models import (
    User,
    Role,
    Profile,
    Education,
    Document,
)


# ======================================================
# REGISTER
# ======================================================

class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    class Meta:
        model = User

        fields = (
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
        )

    def create(self, validated_data):

        password = validated_data.pop(
            "password"
        )

        applicant_role = Role.objects.filter(
            role_name="Applicant"
        ).first()

        if applicant_role is None:
            raise serializers.ValidationError({
                "detail": "Applicant role not found."
            })

        user = User(
            **validated_data,
            role=applicant_role,
        )

        user.set_password(password)
        user.save()

        return user


# ======================================================
# PROFILE
# ======================================================

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile

        fields = [
            "full_name",
            "birth_place",
            "birth_date",
            "gender",
            "phone",
            "nik",
            "profile_photo",
        ]

        extra_kwargs = {
            "profile_photo": {
                "required": False,
                "allow_null": True,
            },
        }


# ======================================================
# EDUCATION
# ======================================================

class EducationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Education

        fields = [
            "education_level",
            "school_name",
            "major",
            "entry_year",
            "graduation_year",
        ]


# ======================================================
# DOCUMENT
# ======================================================

class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document

        fields = [
            "cv_file",
            "ktp_file",
            "kk_file",
        ]


# ======================================================
# LOGIN TOKEN
# ======================================================

class CustomTokenObtainPairSerializer(
    TokenObtainPairSerializer
):

    @classmethod
    def get_token(cls, user):

        token = super().get_token(user)

        # ==========================
        # ROLE
        # ==========================

        token["role"] = (
            user.role.role_name
            if user.role
            else None
        )

        # ==========================
        # USER DATA
        # ==========================

        token["username"] = user.username
        token["email"] = user.email or ""
        token["first_name"] = user.first_name or ""
        token["last_name"] = user.last_name or ""

        return token

    def validate(self, attrs):

        data = super().validate(attrs)

        # ==========================
        # ROLE
        # ==========================

        data["role"] = (
            self.user.role.role_name
            if self.user.role
            else None
        )

        # ==========================
        # USER DATA
        # ==========================

        data["username"] = self.user.username
        data["email"] = self.user.email or ""
        data["first_name"] = (
            self.user.first_name or ""
        )
        data["last_name"] = (
            self.user.last_name or ""
        )

        return data