from django.urls import path
from . import views

urlpatterns = [
    path("tickets", views.ticket_list_create, name="ticket-list-create"),
    path("tickets/<str:ticket_id>", views.ticket_detail, name="ticket-detail"),
]
