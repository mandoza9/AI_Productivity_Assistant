import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bot,
  CalendarDays,
  CheckSquare,
  ChartBar,
  Leaf,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  Settings,
  Sprout,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/email", label: "Email Workspace", icon: Mail },
  { to: "/livestock", label: "Livestock", icon: Sprout },
  { to: "/crops", label: "Crops", icon: Leaf },
  { to: "/meetings", label: "Meeting Notes", icon: NotebookPen },
  { to: "/research", label: "Research Assistant", icon: Search },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/reports", label: "Reports", icon: ChartBar },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  const sidebar = (
    <div className="flex h-full flex-col gap-1 bg-sidebar px-3 py-5">
      <Link to="/" className="mb-6 flex items-center gap-3 px-2" onClick={() => setOpen(false)}>
        <span className="gradient-crop flex size-10 items-center justify-center rounded-xl text-crop-foreground shadow-soft">
          <Leaf className="size-5" />
        </span>
        <span className="leading-tight">
          <span className="block font-display text-base font-semibold text-sidebar-foreground">
            AI Workplace Assistant
          </span>
          <span className="block text-xs text-muted-foreground">AI Workplace</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {nav.map((item) => {
          const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              ].join(" ")}
            >
              <item.icon className="size-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-xl border border-sidebar-border bg-card p-3 text-xs text-muted-foreground shadow-soft">
        <p className="font-display text-sm font-semibold text-foreground">Ubuhle Farms</p>
        <p className="mt-1">348 animals · 74 ha planted</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border lg:block">
        {sidebar}
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border shadow-lift">
            {sidebar}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
            <button
              className="rounded-lg border border-border p-2 text-foreground lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-semibold text-foreground sm:text-2xl">{title}</h1>
              <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <button
              className="relative rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
            </button>
            <span className="gradient-soil hidden size-9 items-center justify-center rounded-full text-sm font-semibold text-livestock-foreground sm:flex">
              A
            </span>
          </div>
        </header>

        <main className="px-4 pb-16 pt-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
