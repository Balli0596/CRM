from django.contrib import admin
from .models import Ticket, Note


class NoteInline(admin.TabularInline):
    model = Note
    extra = 0
    readonly_fields = ["created_at"]


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ["ticket_id", "customer_name", "subject", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["ticket_id", "customer_name", "customer_email", "subject"]
    readonly_fields = ["ticket_id", "created_at", "updated_at"]
    inlines = [NoteInline]


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ["ticket", "created_at"]
