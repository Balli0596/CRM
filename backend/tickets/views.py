from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Ticket, Note
from .serializers import (
    TicketCreateSerializer,
    TicketListSerializer,
    TicketDetailSerializer,
    TicketUpdateSerializer,
)


@api_view(["POST", "GET"])
def ticket_list_create(request):
    if request.method == "POST":
        serializer = TicketCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save()
        return Response(
            {"ticket_id": ticket.ticket_id, "created_at": ticket.created_at},
            status=status.HTTP_201_CREATED,
        )

    # GET /api/tickets?status=Open&search=jane
    tickets = Ticket.objects.all()

    status_filter = request.query_params.get("status")
    if status_filter:
        tickets = tickets.filter(status=status_filter)

    search = request.query_params.get("search")
    if search:
        tickets = tickets.filter(
            Q(customer_name__icontains=search)
            | Q(ticket_id__icontains=search)
            | Q(customer_email__icontains=search)
            | Q(description__icontains=search)
            | Q(subject__icontains=search)
        )

    serializer = TicketListSerializer(tickets, many=True)
    return Response(serializer.data)


@api_view(["GET", "PUT"])
def ticket_detail(request, ticket_id):
    ticket = get_object_or_404(Ticket, ticket_id=ticket_id)

    if request.method == "GET":
        serializer = TicketDetailSerializer(ticket)
        return Response(serializer.data)

    # PUT /api/tickets/{ticket_id} — Body: { status, notes }
    serializer = TicketUpdateSerializer(ticket, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)

    note_text = serializer.validated_data.pop("notes", None)
    if "status" in serializer.validated_data:
        ticket.status = serializer.validated_data["status"]
        ticket.save()
    if note_text:
        Note.objects.create(ticket=ticket, note_text=note_text)

    return Response({"success": True, "updated_at": ticket.updated_at})
