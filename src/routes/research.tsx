import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AiOutput, useFarmAi } from "@/components/AiBox";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant for Farmers — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Research feeding practices, crop diseases, market prices, regulations and agricultural trends with AI summaries and recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant for Farmers — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Summaries, key insights and recommendations on any farming question.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

const examples = [
  "Best feeding practices for dairy cattle",
  "Grey leaf spot control in maize",
  "Current South African maize market prices",
  "Livestock transport regulations in South Africa",
  "Regenerative grazing trends for 2026",
];

function ResearchPage() {
  const [q, setQ] = useState(examples[0]);
  const { run, loading, output, error } = useFarmAi();

  const ask = (question: string) => {
    setQ(question);
    run(
      `Research question from a South African farm manager: "${question}". Answer with these headings: Summary, Key Insights, Recommendations, Reliable Sources (name the organisations or publications and note that figures should be verified).`,
    );
  };

  return (
    <AppShell title="Research Assistant" subtitle="Evidence-based answers for farm decisions">
      <div className="surface p-5">
        <label className="block text-sm font-medium">Your research question</label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input value={q} onChange={(e) => setQ(e.target.value)} className="input-base flex-1" />
          <button
            onClick={() => ask(q)}
            disabled={loading || !q.trim()}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Researching…" : "Research"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {examples.map((e) => (
            <button
              key={e}
              onClick={() => ask(e)}
              className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <AiOutput
          loading={loading}
          output={output}
          error={error}
          empty="Ask a question to get a summary, key insights, recommendations and sources."
        />
      </div>
    </AppShell>
  );
}
