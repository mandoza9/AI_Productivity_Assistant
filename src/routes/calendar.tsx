import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { events as seedEvents, type CalEvent } from "@/lib/farm-data";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Farm Calendar — FarmFlow AI Workplace" },
      {
        name: "description",
        content:
          "Month, week and day views of crop, livestock, meeting and AI-scheduled farm activities with drag and drop.",
      },
      { property: "og:title", content: "Farm Calendar — FarmFlow" },
      {
        property: "og:description",
        content: "Colour-coded farm calendar with Outlook and Google Calendar sync.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

const typeStyle: Record<CalEvent["type"], string> = {
  crop: "bg-crop-soft text-crop",
  livestock: "bg-livestock-soft text-livestock",
  meeting: "bg-meeting-soft text-meeting",
  ai: "bg-ai-soft text-ai",
};

const legend = [
  { label: "Crop activities", key: "crop" as const },
  { label: "Livestock activities", key: "livestock" as const },
  { label: "Meetings", key: "meeting" as const },
  { label: "AI scheduled tasks", key: "ai" as const },
];

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function CalendarPage() {
  const [events, setEvents] = useState(seedEvents);
  const [view, setView] = useState<"Month" | "Week" | "Day">("Month");
  const [dragId, setDragId] = useState<string | null>(null);

  const drop = (day: number) => {
    if (!dragId) return;
    setEvents((prev) => prev.map((e) => (e.id === dragId ? { ...e, day } : e)));
    setDragId(null);
  };

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const visible =
    view === "Month" ? days : view === "Week" ? days.slice(7, 14) : days.slice(8, 9);

  return (
    <AppShell title="Calendar" subtitle="September 2026 · drag events to reschedule">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl bg-muted p-1">
          {(["Month", "Week", "Day"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                view === v ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {legend.map((l) => (
            <span key={l.key} className={`rounded-md px-2 py-1 font-semibold ${typeStyle[l.key]}`}>
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div className="surface mt-5 overflow-hidden p-4">
        {view === "Month" && (
          <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground">
            {weekdays.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        )}
        <div
          className={
            view === "Month"
              ? "grid grid-cols-7 gap-2"
              : view === "Week"
                ? "grid grid-cols-2 gap-3 md:grid-cols-7"
                : "grid gap-3"
          }
        >
          {visible.map((day) => (
            <div
              key={day}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(day)}
              className={`rounded-xl border border-border bg-background p-2 ${
                view === "Month" ? "min-h-24" : "min-h-40"
              }`}
            >
              <p className="mb-1 text-xs font-semibold text-muted-foreground">{day} Sep</p>
              <div className="space-y-1">
                {events
                  .filter((e) => e.day === day)
                  .map((e) => (
                    <div
                      key={e.id}
                      draggable
                      onDragStart={() => setDragId(e.id)}
                      className={`cursor-grab rounded-lg px-2 py-1 text-[11px] font-medium leading-tight ${typeStyle[e.type]}`}
                    >
                      {e.time} {e.title}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="surface p-5">
          <h2 className="text-lg font-semibold">Calendar sync</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-lg bg-muted p-3">
              Google Calendar <span className="text-xs font-semibold text-crop">Ready to connect</span>
            </li>
            <li className="flex items-center justify-between rounded-lg bg-muted p-3">
              Outlook Calendar <span className="text-xs font-semibold text-crop">Ready to connect</span>
            </li>
          </ul>
        </div>
        <div className="surface p-5">
          <h2 className="text-lg font-semibold">AI scheduling suggestions</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Move Friday irrigation to Thursday — 70% chance of rain.</li>
            <li>Group the vet visit and deworming round to save a call-out fee.</li>
            <li>Book the harvest contractor for 24–26 September.</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
