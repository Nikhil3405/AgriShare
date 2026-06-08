from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import serializers
from .serializers import RegisterSerializer, UserProfileSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import (
    MultiPartParser,
    FormParser
)

User=get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset=User.objects.all()
    serializer_class=RegisterSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes=[AllowAny]

class CustomTokenSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        email = attrs.get("username")
        password = attrs.get("password")

        user = User.objects.filter(email__iexact=email).first()
        print("Email provided:", email)
        print("Username provided:", user)
        print("User found:", user)
        if not user or not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password")

        data = super().validate({
            "username": user.username,
            "password": password
        })

        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone_number": user.phone_number,
            "village": user.village,
            "profile_image": (
                user.profile_image.url
                if user.profile_image
                else None
            ),
        }

        return data
    
    
class CustomTokenView(TokenObtainPairView):
    serializer_class = CustomTokenSerializer
    
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    parser_classes = [
        MultiPartParser,
        FormParser
    ]

    def get(self, request):
        serializer = UserProfileSerializer(
            request.user
        )
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )
        
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password =request.data.get(
                "old_password"
            )

        new_password = request.data.get(
                "new_password"
            )

        if not request.user.check_password(
            old_password
        ):
            return Response(
                {
                    "error":
                    "Old password incorrect"
                },
                status=400
            )

        request.user.set_password(
            new_password
        )

        request.user.save()

        return Response(
            {
                "message":
                "Password changed"
            }
        )