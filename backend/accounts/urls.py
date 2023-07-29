from django.urls import path
from .views import AccountLogin, AccountCreate,AccountVerifyToken

urlpatterns = [
    path('login', AccountLogin.as_view()),
    path('register', AccountCreate.as_view()), 
    path('verify-token', AccountVerifyToken.as_view()),
]
