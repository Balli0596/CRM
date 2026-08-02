import { NavLink, Outlet } from "react-router-dom";

const navItem =
  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink-900 font-sans">
      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ink-200/70 bg-ink-950 px-4 py-6 text-ink-100 md:flex">
          <div className="mb-8 flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-signal-open font-mono text-sm font-bold text-ink-950">
              /
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400">
                Datastraw
              </p>
              <p className="text-sm font-semibold">Support Desk</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "bg-ink-800 text-white"
                    : "text-ink-200 hover:bg-ink-900 hover:text-white"
                }`
              }
            >
              All tickets
            </NavLink>
            <NavLink
              to="/new"
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "bg-ink-800 text-white"
                    : "text-ink-200 hover:bg-ink-900 hover:text-white"
                }`
              }
            >
              New ticket
            </NavLink>
          </nav>

          <div className="mt-auto rounded-lg border border-ink-800 bg-ink-900 px-3 py-3">
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink-400">
              Status legend
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-ink-200">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-open" /> Open
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-progress" /> In
                progress
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-signal-closed" /> Closed
              </li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-h-screen flex-1 px-5 py-6 md:px-10 md:py-8">
          {/* Mobile nav */}
          <div className="mb-6 flex items-center justify-between rounded-lg border border-ink-200 bg-ink-950 px-4 py-3 text-ink-100 md:hidden">
            <span className="font-mono text-xs uppercase tracking-widest text-ink-400">
              Datastraw Support
            </span>
            <nav className="flex gap-2 text-sm">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `rounded px-2 py-1 ${isActive ? "bg-ink-800 text-white" : "text-ink-300"}`
                }
              >
                Tickets
              </NavLink>
              <NavLink
                to="/new"
                className={({ isActive }) =>
                  `rounded px-2 py-1 ${isActive ? "bg-ink-800 text-white" : "text-ink-300"}`
                }
              >
                New
              </NavLink>
            </nav>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
