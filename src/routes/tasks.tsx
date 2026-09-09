import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AiOutput, useFarmAi } from "@/components/AiBox";
import { tasks as seedTasks, type Priority } from "@/lib/farm-data";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Scheduler — FarmFlow" },
      {
        name: "description",
        content:
          "Plan daily, weekly and monthly farm work with AI prioritisation for crops, livestock and admin tasks.",
      },
      { property: "og:title", content: "AI Task Planner & Scheduler — FarmFlow" },
      {
        property: "og:description",
        content: "AI-prioritised daily, weekly and monthly farm schedules.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TasksPage,
});

const priorityStyle: Record<Priority, string> = {
  high: "bg-destructive/15 text-destructive",
  medium: "bg-warning/20 text-foreground",
  low: "bg-crop-soft text-crop",
};

function TasksPage() {
  const [items, setItems] = useState(seedTasks);
  const [range, setRange] = useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const { run, loading, output, error } = useFarmAi();

  const toggle = (id: string) =>
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const plan = () =>
    run(
      `Create a ${range.toLowerCase()} farm work plan for a 74 ha mixed crop and livestock farm in KwaZulu-Natal with 348 animals (142 dairy cattle) and maize, soybean, wheat and cabbage blocks. Outstanding tasks: ${items
        .filter((t) => !t.done)
        .map((t) => `${t.title} (${t.priority}, ${t.category})`)
        .join("; ")}. Give times, assign a High/Medium/Low priority to each item and keep it under 250 words.`,
    );

  return (
    <AppShell title="Tasks" subtitle="AI task planner and scheduler">
      <div className="grid gap-5 lg:grid-cols-3">
        <section className="surface p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Task list</h2>
            <div className="flex gap-1 rounded-xl bg-muted p-1">
              {(["Daily", "Weekly", "Monthly"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    range === r ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <ul className="mt-4 divide-y divide-border">
            {items.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t.id)}
                  className="size-4 accent-primary"
                  aria-label={t.title}
                />
                <span className="w-24 shrink-0 text-sm text-muted-foreground">{t.time}</span>
                <span
                  className={`flex-1 text-sm ${t.done ? "text-muted-foreground line-through" : "text-foreground"}`}
                >
                  {t.title}
                </span>
                <span className="hidden rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline">
                  {t.category}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${priorityStyle[t.priority]}`}
                >
                  {t.priority}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <div className="surface p-5">
            <h2 className="text-lg font-semibold">AI planner</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Build a prioritised {range.toLowerCase()} plan from your open tasks.
            </p>
            <button
              onClick={plan}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Planning…" : `Generate ${range.toLowerCase()} plan`}
            </button>
          </div>
          <AiOutput
            loading={loading}
            output={output}
            error={error}
            empty="Your AI-generated schedule will appear here with High, Medium and Low priority labels."
          />
        </section>
      </div>
    </AppShell>
  );
}
