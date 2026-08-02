import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const initialForm = {
  customer_name: "",
  customer_email: "",
  subject: "",
  description: "",
};

export default function NewTicket() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await api.createTicket(form);
      navigate(`/tickets/${result.ticket_id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-400">
          New entry
        </p>
        <h1 className="text-2xl font-bold text-ink-950 md:text-3xl">
          Create a ticket
        </h1>
        <p className="mt-1.5 text-sm text-ink-500">
          A ticket ID and timestamp are generated automatically once you submit.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-ink-200 bg-white p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Customer name" htmlFor="customer_name">
            <input
              id="customer_name"
              required
              value={form.customer_name}
              onChange={update("customer_name")}
              placeholder="Jane Doe"
              className={inputClass}
            />
          </Field>
          <Field label="Customer email" htmlFor="customer_email">
            <input
              id="customer_email"
              type="email"
              required
              value={form.customer_email}
              onChange={update("customer_email")}
              placeholder="jane@example.com"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Issue title" htmlFor="subject">
          <input
            id="subject"
            required
            value={form.subject}
            onChange={update("subject")}
            placeholder="Can't log in to my account"
            className={inputClass}
          />
        </Field>

        <Field label="Description" htmlFor="description">
          <textarea
            id="description"
            required
            rows={5}
            value={form.description}
            onChange={update("description")}
            placeholder="Describe what the customer reported…"
            className={`${inputClass} resize-y`}
          />
        </Field>

        {error && (
          <p className="rounded-lg border border-signal-open/30 bg-signal-open/10 px-4 py-2.5 text-sm text-signal-open">
            Couldn't create ticket: {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-60"
          >
            {submitting ? "Creating…" : "Create ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-700 focus:outline-none focus:ring-2 focus:ring-ink-700/10";

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
