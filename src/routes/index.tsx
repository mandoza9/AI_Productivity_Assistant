import { createFileRoute, Link } from "@tanstack/react-router";
import { CloudRain, Sun, ArrowRight, Sparkle, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { dailySummary, emails, farmer, kpis, reminders, tasks, weather } from "@/lib/farm-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FarmFlow AI Workplace — Dashboard for Crop & Livestock Farms" },
      {
        name: "description",
        content:
          "Run your farm from one AI workplace: tasks, calendar, email, livestock, crops, meeting notes and reports.",
      },
      { property: "og:title", content: "FarmFlow AI Workplace — Farm Dashboard" },
      {
        property: "og:description",
        content:
          "Manage farm operations, emails, schedules, livestock and crops from one intelligent workplace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const toneClass: Record<string, string> = {
  crop: "bg-crop-soft text-crop",
  livestock: "bg-livestock-soft text-livestock",
  meeting: "bg-meeting-soft text-meeting",
  ai: "bg-ai-soft text-ai",
};

function Dashboard() {
  const today = tasks.filter((t) => !t.done).slice(0, 5);

  return (
    <AppShell title={`Good morning, ${farmer.name}`} subtitle="Wednesday 9 September · Ubuhle Farms">
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {kpis.map((k) => (
              <div key={k.label} className="surface p-4">
                <span
                  className={`inline-flex rounded-lg px-2 py-1 text-xs font-semibold ${toneClass[k.tone]}`}
                >
                  {k.label}
                </span>
                <p className="mt-3 font-display text-3xl font-semibold text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.hint}</p>
              </div>
            ))}
          </div>

          <div className="surface gradient-ai p-5 text-crop-foreground">
            <div className="flex items-center gap-2">
              <Sparkle className="size-5" />
              <h2 className="text-lg font-semibold">AI daily summary</h2>
            </div>
            <ul className="mt-4 space-y-2.5">
              {dailySummary.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 opacity-90" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/assistant"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-card/95 px-4 py-2 text-sm font-semibold text-foreground"
            >
              Ask the AI assistant <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today's schedule</h2>
              <Link to="/tasks" className="text-sm font-medium text-primary">
                All tasks
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-border">
              {today.map((t) => (
                <li key={t.id} className="flex items-center gap-3 py-3">
                  <span className="w-16 shrink-0 text-sm font-semibold text-muted-foreground">
                    {t.time}
                  </span>
                  <span className="flex-1 text-sm text-foreground">{t.title}</span>
                  <PriorityDot priority={t.priority} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="surface p-5">
            <h2 className="text-lg font-semibold">Weather · {weather.place}</h2>
            <div className="mt-3 flex items-center gap-3">
              <Sun className="size-9 text-warning" />
              <div>
                <p className="font-display text-3xl font-semibold">{weather.today.temp}°C</p>
                <p className="text-xs text-muted-foreground">
                  {weather.today.condition} · {weather.today.rain}% rain
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
              {weather.forecast.map((d) => (
                <div key={d.day} className="rounded-lg bg-muted p-2">
                  <p className="text-xs font-semibold">{d.day}</p>
                  {d.rain > 50 ? (
                    <CloudRain className="mx-auto my-1 size-4 text-meeting" />
                  ) : (
                    <Sun className="mx-auto my-1 size-4 text-warning" />
                  )}
                  <p className="text-xs text-muted-foreground">{d.temp}°</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Priority inbox</h2>
              <Link to="/email" className="text-sm font-medium text-primary">
                Open
              </Link>
            </div>
            <ul className="mt-3 space-y-3">
              {emails
                .filter((e) => e.priority === "urgent" || e.priority === "high")
                .map((e) => (
                  <li key={e.id} className="rounded-xl bg-muted p-3">
                    <p className="text-sm font-semibold text-foreground">{e.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {e.from} · {e.time}
                    </p>
                  </li>
                ))}
            </ul>
          </div>

          <div className="surface p-5">
            <h2 className="text-lg font-semibold">Automated reminders</h2>
            <ul className="mt-3 space-y-3">
              {reminders.map((r) => (
                <li key={r.text} className="text-sm">
                  <span className="mr-2 rounded-md bg-crop-soft px-2 py-0.5 text-xs font-semibold text-crop">
                    {r.channel}
                  </span>
                  {r.text}
                  <span className="block text-xs text-muted-foreground">{r.when}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

export function PriorityDot({ priority }: { priority: "high" | "medium" | "low" }) {
  const map = {
    high: "bg-destructive/15 text-destructive",
    medium: "bg-warning/20 text-foreground",
    low: "bg-crop-soft text-crop",
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${map[priority]}`}>
      {priority}
    </span>
  );
}
