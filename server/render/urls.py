from django.urls import path
from .views import chat_reply

urlpatterns = [
    path("chat/", chat_reply),
]