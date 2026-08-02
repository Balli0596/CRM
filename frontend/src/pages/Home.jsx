import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import StatusBadge from "../components/StatusBadge";

const STATUS_TABS = ["All", "Open", "In Progress", "Closed"];

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .listTickets({ search, status: status === "All" ? "" : status })
        .then((data) => {
          setTickets(data);
          setError("");
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 250); // debounce as-you-type search

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, status]);

  return (
    <div>
      <header className="mb-6 flex flex-col gap-1">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-400">
          Queue
        </p>
        <h1 className="text-2xl font-bold text-ink-950 md:text-3xl">
          All tickets
        </h1>
      </header>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, ID, email, description…"
          className="w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-700 focus:outline-none focus:ring-2 focus:ring-ink-700/10 sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatus(tab)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === tab
                  ? "border-ink-950 bg-ink-950 text-white"
                  : "border-ink-200 bg-white text-ink-600 hover:border-ink-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-signal-open/30 bg-signal-open/10 px-4 py-3 text-sm text-signal-open">
          Couldn't load tickets: {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-ink-200 bg-white">
        <div className="hidden grid-cols-[110px_1fr_1.4fr_130px_140px] gap-3 border-b border-ink-100 bg-ink-50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-400 md:grid">
          <span>ID</span>
          <span>Customer</span>
          <span>Subject</span>
          <span>Status</span>
          <span>Created</span>
        </div>

        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-ink-400">
            Loading tickets…
          </p>
        ) : tickets.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="text-sm font-medium text-ink-700">
              No tickets match this view.
            </p>
            <p className="mt-1 text-sm text-ink-400">
              Try a different search or status, or{" "}
              <Link to="/new" className="font-semibold text-ink-900 underline">
                create a new ticket
              </Link>
              .
            </p>
          </div>
        ) : (
          tickets.map((t) => (
            <Link
              key={t.ticket_id}
              to={`/tickets/${t.ticket_id}`}
              className="grid grid-cols-2 items-center gap-3 border-b border-ink-100 px-5 py-3.5 text-sm last:border-b-0 hover:bg-ink-50 md:grid-cols-[110px_1fr_1.4fr_130px_140px]"
            >
              <span className="font-mono text-xs font-semibold text-ink-600">
                {t.ticket_id}
              </span>
              <span className="truncate font-medium text-ink-900">
                {t.customer_name}
              </span>
              <span className="col-span-2 truncate text-ink-600 md:col-span-1">
                {t.subject}
              </span>
              <span>
                <StatusBadge status={t.status} />
              </span>
              <span className="text-xs text-ink-400">
                {new Date(t.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
