import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { AiOutput, useFarmAi } from "@/components/AiBox";
import { cropAlerts, crops } from "@/lib/farm-data";

export const Route = createFileRoute("/crops")({
  head: () => ({
    meta: [
      { title: "Crop Management — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Track crop types, planting dates, irrigation, growth stages and harvest dates with AI fertiliser and disease alerts.",
      },
      { property: "og:title", content: "Crop Management — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Growth stages, irrigation plans and AI crop recommendations in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CropsPage,
});

function CropsPage() {
  const { run, loading, output, error } = useFarmAi();

  return (
    <AppShell title="Crops" subtitle="74 ha planted across 4 blocks">
      <div className="grid gap-4 md:grid-cols-2">
        {crops.map((c) => (
          <div key={c.id} className="surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{c.name}</h2>
                <p className="text-sm text-muted-foreground">{c.block}</p>
              </div>
              <span className="rounded-md bg-crop-soft px-2 py-1 text-xs font-semibold text-crop">
                {c.stage}
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
              <div className="gradient-crop h-full rounded-full" style={{ width: `${c.progress}%` }} />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{c.progress}% of season complete</p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Planted</dt>
                <dd className="font-semibold text-foreground">{c.planted}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Irrigation</dt>
                <dd className="font-semibold text-foreground">{c.irrigation}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Harvest</dt>
                <dd className="font-semibold text-foreground">{c.harvest}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="text-lg font-semibold">AI crop alerts</h2>
          <ul className="mt-3 space-y-3 text-sm">
            {cropAlerts.map((a) => (
              <li
                key={a.crop}
                className={`rounded-xl p-3 ${a.tone === "warning" ? "bg-warning/15" : "bg-crop-soft"}`}
              >
                <span className="font-semibold text-foreground">{a.crop}: </span>
                <span className="text-muted-foreground">{a.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="surface p-5">
            <h2 className="text-lg font-semibold">AI agronomist</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fertiliser suggestions, disease risk and harvest readiness for your blocks.
            </p>
            <button
              onClick={() =>
                run(
                  `Act as an agronomist for a KwaZulu-Natal farm. For each block give fertiliser suggestions, disease risk and harvest readiness. Rain of 70-85% is forecast Friday and Saturday.\n${crops
                    .map((c) => `${c.name} | ${c.block} | planted ${c.planted} | stage ${c.stage} | harvest ${c.harvest} | irrigation ${c.irrigation}`)
                    .join("\n")}`,
                )
              }
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Analysing…" : "Get AI recommendations"}
            </button>
          </div>
          <AiOutput
            loading={loading}
            output={output}
            error={error}
            empty="Fertiliser, disease and harvest advice for each block will appear here."
          />
        </div>
      </div>
    </AppShell>
  );
}
