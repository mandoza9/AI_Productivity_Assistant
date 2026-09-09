import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AiOutput, useFarmAi } from "@/components/AiBox";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summariser — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn long farm meeting notes into a summary with key decisions, action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summariser — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Paste or upload farm meeting notes and get decisions, actions and deadlines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeetingsPage,
});

const sample = `Weekly farm meeting - 8 September
Present: farm manager, herdsman, agronomy assistant, two seasonal supervisors.
Milk volumes dropped slightly in camp 3, likely because the feed mix arrived late twice last week. Herdsman suggests increasing the feeding schedule to three times a day for the dairy group and moving milking 30 minutes earlier.
Feed order must go to AgriFeed before Friday cut-off or delivery slips to the following week.
Vet needs to be booked for the heifer group - vaccinations and pregnancy checks.
Maize block B is flowering, grey leaf spot spotted on two rows near the fence line. Agronomy assistant to scout the whole block after the rain.
Seasonal supervisors asked about the harvest roster; manager will publish it by 15 September.`;

function MeetingsPage() {
  const [notes, setNotes] = useState(sample);
  const { run, loading, output, error } = useFarmAi();

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setNotes(await file.text());
  };

  return (
    <AppShell title="Meeting Notes" subtitle="Turn long farm meetings into clear actions">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="text-lg font-semibold">Meeting notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={16}
            className="input-base mt-3"
            placeholder="Paste your meeting notes here…"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                run(
                  `Summarise these farm meeting notes. Use exactly these headings: Meeting Summary, Key Decisions, Action Items (with owner), Deadlines.\n\n${notes}`,
                )
              }
              disabled={loading || !notes.trim()}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Summarising…" : "Summarise meeting"}
            </button>
            <label className="cursor-pointer rounded-xl border border-border px-4 py-2.5 text-sm font-medium">
              Upload notes (.txt, .md)
              <input
                type="file"
                accept=".txt,.md,text/plain"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0])}
              />
            </label>
          </div>
        </section>

        <section className="space-y-4">
          <AiOutput
            loading={loading}
            output={output}
            error={error}
            empty="Your summary, key decisions, action items and deadlines will appear here."
          />
          <div className="surface p-5">
            <h2 className="text-lg font-semibold">Recent summaries</h2>
            <ul className="mt-3 space-y-3 text-sm">
              {[
                { t: "Harvest planning · 2 Sep", d: "Contractor booked; 3 actions, 1 overdue" },
                { t: "Co-op audit prep · 26 Aug", d: "Input records to be sent by 20 Sep" },
                { t: "Herd health review · 19 Aug", d: "Deworming moved to 22 Sep" },
              ].map((s) => (
                <li key={s.t} className="rounded-xl bg-muted p-3">
                  <p className="font-semibold text-foreground">{s.t}</p>
                  <p className="text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
