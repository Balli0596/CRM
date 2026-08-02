from django.urls import path
from . import views

from django.http import HttpResponse

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("tickets.urls")),
    path("test", lambda request: HttpResponse("Railway is updated")),
]
