import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";

const STATUSES = ["Open", "In Progress", "Closed"];

export default function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [noteText, setNoteText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .getTicket(ticketId)
      .then((data) => {
        setTicket(data);
        setStatus(data.status);
        setError("");
      })
      .catch((err) => setError(err.message));
  };

  useEffect(load, [ticketId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateTicket(ticketId, {
        status,
        notes: noteText.trim() || undefined,
      });
      setNoteText("");
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (error && !ticket) {
    return (
      <div>
        <Link to="/" className="text-sm font-medium text-ink-600 hover:underline">
          ← Back to tickets
        </Link>
        <p className="mt-6 rounded-lg border border-signal-open/30 bg-signal-open/10 px-4 py-3 text-sm text-signal-open">
          Couldn't load ticket {ticketId}: {error}
        </p>
      </div>
    );
  }

  if (!ticket) {
    return <p className="text-sm text-ink-400">Loading ticket…</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="text-sm font-medium text-ink-600 hover:underline">
        ← Back to tickets
      </Link>

      <header className="mt-4 mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
            {ticket.ticket_id}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-ink-950 md:text-3xl">
            {ticket.subject}
          </h1>
        </div>
        <StatusBadge status={ticket.status} />
      </header>

      <section className="mb-6 grid gap-4 rounded-xl border border-ink-200 bg-white p-6 sm:grid-cols-2">
        <Info label="Customer" value={ticket.customer_name} />
        <Info label="Email" value={ticket.customer_email} />
        <Info
          label="Created"
          value={new Date(ticket.created_at).toLocaleString()}
        />
        <Info
          label="Last updated"
          value={new Date(ticket.updated_at).toLocaleString()}
        />
        <div className="sm:col-span-2">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500">
            Description
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-800">
            {ticket.description}
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-ink-200 bg-white p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
          Activity
        </p>
        {ticket.notes.length === 0 ? (
          <p className="text-sm text-ink-400">No notes yet.</p>
        ) : (
          <ol className="space-y-3 border-l-2 border-ink-100 pl-4">
            {ticket.notes.map((note) => (
              <li key={note.id} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-ink-400" />
                <p className="text-sm text-ink-800">{note.note_text}</p>
                <p className="mt-0.5 text-xs text-ink-400">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="rounded-xl border border-ink-200 bg-white p-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
          Update ticket
        </p>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Status
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    status === s
                      ? "border-ink-950 bg-ink-950 text-white"
                      : "border-ink-200 bg-white text-ink-600 hover:border-ink-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="note"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500"
            >
              Add a note (optional)
            </label>
            <textarea
              id="note"
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="What did you do to resolve this?"
              className="w-full resize-y rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-700 focus:outline-none focus:ring-2 focus:ring-ink-700/10"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-signal-open/30 bg-signal-open/10 px-4 py-2.5 text-sm text-signal-open">
              Couldn't save: {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </p>
      <p className="text-sm text-ink-900">{value}</p>
    </div>
  );
}
