from django.urls import path, include
from django.http import HttpResponse

urlpatterns = [
    path('', lambda r:
        HttpResponse('Infinite Canvas Server — WebSocket endpoint at /ws/render/')),
    path("api/", include('render.urls'))
]
