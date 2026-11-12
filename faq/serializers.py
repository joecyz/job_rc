from rest_framework import serializers
from .models import FAQ

class FAQSerializer(serializers.ModelSerializer):

    class Meta:

        model = FAQ

        fields = (
            "id",
            "question",
            "answer",
        )

class FAQManageSerializer(serializers.ModelSerializer):

    class Meta:

        model = FAQ

        fields = (
            "id",
            "question",
            "answer",
            "is_active",
        )

    def validate(self, attrs):

        question = attrs.get(
            "question",
            getattr(self.instance, "question", "")
        ).strip()

        answer = attrs.get(
            "answer",
            getattr(self.instance, "answer", "")
        ).strip()

        if not question:

            raise serializers.ValidationError({

                "question":
                    "Question cannot be empty."

            })

        if not answer:

            raise serializers.ValidationError({

                "answer":
                    "Answer cannot be empty."

            })

        return attrs