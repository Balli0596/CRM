from rest_framework import serializers
from .models import Ticket, Note


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "note_text", "created_at"]


class TicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["customer_name", "customer_email", "subject", "description"]


class TicketListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ["ticket_id", "customer_name", "subject", "status", "created_at"]


class TicketDetailSerializer(serializers.ModelSerializer):
    notes = NoteSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            "ticket_id",
            "customer_name",
            "customer_email",
            "subject",
            "description",
            "status",
            "created_at",
            "updated_at",
            "notes",
        ]


class TicketUpdateSerializer(serializers.ModelSerializer):
    notes = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Ticket
        fields = ["status", "notes"]

    def validate_status(self, value):
        valid = [choice[0] for choice in Ticket.STATUS_CHOICES]
        if value not in valid:
            raise serializers.ValidationError(f"status must be one of {valid}")
        return value
