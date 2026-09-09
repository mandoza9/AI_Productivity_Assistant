import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AiOutput, useFarmAi } from "@/components/AiBox";
import { emails } from "@/lib/farm-data";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator & AI Inbox — AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Write professional farm emails with AI, categorise your inbox by priority and get draft reply suggestions.",
      },
      { property: "og:title", content: "Smart Email Generator & AI Inbox — AI Workplace Assistant" },
      {
        property: "og:description",
        content: "AI email writing, inbox triage and reply suggestions for farm managers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const tones = ["Formal", "Friendly", "Persuasive", "Complaint", "Request", "Follow-Up"] as const;

const priorityStyle: Record<string, string> = {
  urgent: "bg-destructive/15 text-destructive",
  high: "bg-warning/20 text-foreground",
  low: "bg-crop-soft text-crop",
  spam: "bg-muted text-muted-foreground",
};

function EmailPage() {
  const [subject, setSubject] = useState("Request for updated livestock feed quotation");
  const [purpose, setPurpose] = useState(
    "Ask AgriFeed Supplies for an updated quarterly quotation for dairy cattle feed, including delivery costs.",
  );
  const [tone, setTone] = useState<(typeof tones)[number]>("Formal");
  const [recipient, setRecipient] = useState("AgriFeed Supplies");
  const { run, loading, output, error } = useFarmAi();

  const system =
    "You are AI Workplace Assistant's email writer for a South African farm manager. Return only the email: subject line, greeting, body and sign-off as 'Farm Manager'. No commentary.";

  const generate = () =>
    run(
      `Write a ${tone.toLowerCase()} email to ${recipient}. Subject: ${subject}. Purpose: ${purpose}.`,
      system,
    );

  const rewrite = (instruction: string) =>
    run(
      `${instruction}\n\nEmail context — recipient: ${recipient}; subject: ${subject}; purpose: ${purpose}; current draft:\n${output || "(no draft yet, write one first)"}`,
      system,
    );

  return (
    <AppShell title="Email Workspace" subtitle="Smart email generator and AI inbox management">
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="space-y-4">
          <div className="surface p-5">
            <h2 className="text-lg font-semibold">Smart email generator</h2>
            <div className="mt-4 space-y-3">
              <Field label="Recipient">
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="input-base"
                />
              </Field>
              <Field label="Subject">
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-base"
                />
              </Field>
              <Field label="Purpose">
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  className="input-base"
                />
              </Field>
              <Field label="Tone">
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                        tone === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <button
              onClick={generate}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {loading ? "Writing…" : "Generate email"}
            </button>
            <div className="mt-3 flex flex-wrap gap-2">
              <SmallBtn onClick={() => rewrite("Rewrite this email more clearly and concisely.")}>
                Rewrite
              </SmallBtn>
              <SmallBtn onClick={() => rewrite("Improve the tone of this email to be warmer but still professional.")}>
                Improve tone
              </SmallBtn>
              <SmallBtn onClick={() => rewrite("Translate this email into isiZulu, keeping it professional.")}>
                Translate
              </SmallBtn>
              <SmallBtn
                onClick={() =>
                  run(
                    `Summarise this farm inbox into urgent actions and who to reply to first:\n${emails
                      .map((e) => `${e.priority.toUpperCase()} | ${e.from} | ${e.subject} | ${e.preview}`)
                      .join("\n")}`,
                  )
                }
              >
                Summarise inbox
              </SmallBtn>
            </div>
          </div>
          <AiOutput
            loading={loading}
            output={output}
            error={error}
            empty="Your generated email will appear here, ready to copy into Gmail or Outlook."
          />
        </section>

        <section className="space-y-4">
          <div className="surface p-5">
            <h2 className="text-lg font-semibold">Unified inbox</h2>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {["Gmail", "Outlook", "Microsoft 365"].map((p) => (
                <span key={p} className="rounded-md bg-muted px-2 py-1 font-semibold text-muted-foreground">
                  {p} · connect
                </span>
              ))}
            </div>
            <ul className="mt-4 space-y-3">
              {emails.map((e) => (
                <li key={e.id} className="rounded-xl border border-border p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${priorityStyle[e.priority]}`}
                    >
                      {e.priority}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {e.category}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">{e.time}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">{e.subject}</p>
                  <p className="text-xs text-muted-foreground">{e.from}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.preview}</p>
                  <p className="mt-2 rounded-lg bg-ai-soft p-2 text-xs text-foreground">
                    <span className="font-semibold text-ai">AI reply suggestion: </span>
                    {e.suggestion}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function SmallBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </button>
  );
}
