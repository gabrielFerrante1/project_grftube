from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException

from rest_framework_simplejwt.tokens import RefreshToken 

from rest_framework.permissions import AllowAny 

from accounts.auth import Authentication

class AccountLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request): 
        email = request.data.get('email')
        password = request.data.get('password')
     
        user = Authentication.signin(self, email=email, password=password)
        refresh = RefreshToken.for_user(user)
      
        return Response({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })


class AccountCreate(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')

        user = Authentication.signup(
            self, name=name, email=email, password=password)
        refresh = RefreshToken.for_user(user)
         
        return Response({
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            },
            "refresh": str(refresh),
            "access": str(refresh.access_token)
        })

class AccountVerifyToken(APIView):
    def get(self, request): 
    
        return Response({
            'user': {
                'id': request.user.id,
                'name': request.user.name,
                'email': request.user.email,
            }
        })