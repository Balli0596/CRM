const STYLES = {
  Open: "bg-signal-open/10 text-signal-open border-signal-open/30",
  "In Progress": "bg-signal-progress/10 text-signal-progress border-signal-progress/30",
  Closed: "bg-signal-closed/10 text-signal-closed border-signal-closed/30",
};

const DOT = {
  Open: "bg-signal-open",
  "In Progress": "bg-signal-progress",
  Closed: "bg-signal-closed",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${
        STYLES[status] || "bg-ink-100 text-ink-600 border-ink-200"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[status] || "bg-ink-400"}`} />
      {status}
    </span>
  );
}
