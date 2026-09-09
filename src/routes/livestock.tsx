import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AiOutput, useFarmAi } from "@/components/AiBox";
import { livestock } from "@/lib/farm-data";

export const Route = createFileRoute("/livestock")({
  head: () => ({
    meta: [
      { title: "Livestock Management — FarmFlow AI Workplace" },
      {
        name: "description",
        content:
          "Track animal IDs, breeds, health status and vaccination records with automatic AI reminders for vet visits and breeding cycles.",
      },
      { property: "og:title", content: "Livestock Management — FarmFlow" },
      {
        property: "og:description",
        content: "Animal records, health status and AI reminders for vaccinations and breeding.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LivestockPage,
});

const healthStyle: Record<string, string> = {
  Healthy: "bg-crop-soft text-crop",
  Monitor: "bg-warning/20 text-foreground",
  Treatment: "bg-destructive/15 text-destructive",
};

function LivestockPage() {
  const { run, loading, output, error } = useFarmAi();

  return (
    <AppShell title="Livestock" subtitle="348 animals · 142 dairy cattle · 3 herds">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total animals", value: "348" },
          { label: "Health alerts", value: "2" },
          { label: "Actions due this week", value: "5" },
        ].map((s) => (
          <div key={s.label} className="surface p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="font-display text-3xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="surface mt-5 overflow-x-auto p-5">
        <h2 className="text-lg font-semibold">Animal register</h2>
        <table className="mt-4 w-full min-w-160 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="pb-2">Animal ID</th>
              <th className="pb-2">Breed</th>
              <th className="pb-2">Age</th>
              <th className="pb-2">Health</th>
              <th className="pb-2">Next action</th>
              <th className="pb-2">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {livestock.map((a) => (
              <tr key={a.id}>
                <td className="py-3 font-semibold text-foreground">{a.tag}</td>
                <td className="py-3 text-muted-foreground">{a.breed}</td>
                <td className="py-3 text-muted-foreground">{a.age}</td>
                <td className="py-3">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${healthStyle[a.health]}`}>
                    {a.health}
                  </span>
                </td>
                <td className="py-3 text-muted-foreground">{a.nextAction}</td>
                <td className="py-3 text-muted-foreground">{a.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="text-lg font-semibold">Automatic reminders</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              "Vaccination due today — ZA-1042 (Holstein)",
              "Deworming round scheduled 22 September",
              "Vet follow-up for ZA-2277 tomorrow 08:30",
              "Breeding cycle window opens 1 October for Dorper ewes",
            ].map((r) => (
              <li key={r} className="rounded-lg bg-livestock-soft p-3 text-foreground">
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="surface p-5">
            <h2 className="text-lg font-semibold">AI herd health advisor</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Get guidance based on your current register.
            </p>
            <button
              onClick={() =>
                run(
                  `Review this livestock register for a KwaZulu-Natal farm and give health, vaccination and breeding priorities for the next two weeks:\n${livestock
                    .map((a) => `${a.tag} | ${a.breed} | ${a.age} | ${a.health} | next: ${a.nextAction} due ${a.due}`)
                    .join("\n")}`,
                )
              }
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-livestock px-4 py-2.5 text-sm font-semibold text-livestock-foreground disabled:opacity-60"
            >
              {loading ? "Analysing…" : "Get AI recommendations"}
            </button>
          </div>
          <AiOutput
            loading={loading}
            output={output}
            error={error}
            empty="AI herd recommendations for vaccinations, deworming, vet visits and breeding will appear here."
          />
        </div>
      </div>
    </AppShell>
  );
}
