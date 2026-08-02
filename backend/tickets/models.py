from django.db import models
from django.db.models import Max


class Ticket(models.Model):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    CLOSED = "Closed"
    STATUS_CHOICES = [
        (OPEN, "Open"),
        (IN_PROGRESS, "In Progress"),
        (CLOSED, "Closed"),
    ]

    ticket_id = models.CharField(max_length=20, unique=True, editable=False)
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    subject = models.CharField(max_length=200)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            self.ticket_id = self._generate_ticket_id()
        super().save(*args, **kwargs)

    def _generate_ticket_id(self):
        # TKT-001, TKT-002, ... derived from the highest existing numeric suffix.
        last = Ticket.objects.aggregate(max_id=Max("id"))["max_id"] or 0
        return f"TKT-{last + 1:03d}"

    def __str__(self):
        return f"{self.ticket_id} - {self.subject}"


class Note(models.Model):
    ticket = models.ForeignKey(Ticket, related_name="notes", on_delete=models.CASCADE)
    note_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Note on {self.ticket.ticket_id}"
