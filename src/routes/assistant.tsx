import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Leaf, Loader2, Send } from "lucide-react";
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { askFarmAi } from "@/lib/ai.functions";
import { crops, livestock, tasks } from "@/lib/farm-data";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — FarmFlow AI Workplace" },
      {
        name: "description",
        content:
          "Your farm copilot: create feeding schedules, draft emails, summarise notes and review overdue tasks in a chat.",
      },
      { property: "og:title", content: "AI Assistant — FarmFlow" },
      {
        property: "og:description",
        content: "Chat with your farm copilot to plan work, draft emails and get answers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const prompts = [
  "Create a feeding schedule for the dairy group",
  "Generate a weekly farm plan",
  "Show overdue tasks and what to do first",
  "Draft an email to the veterinarian",
  "Summarise this week's crop risks",
];

function AssistantPage() {
  const ask = useServerFn(askFarmAi);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Sawubona Asiphile! I'm your FarmFlow copilot. Ask me to plan work, draft an email, summarise notes or check what's overdue.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const res = await ask({
      data: {
        system: `You are FarmFlow AI, the copilot inside a farm workplace app for Asiphile at Ubuhle Farms, KwaZulu-Natal. Farm context — open tasks: ${tasks
          .filter((t) => !t.done)
          .map((t) => `${t.title} (${t.priority})`)
          .join("; ")}. Crops: ${crops
          .map((c) => `${c.name} ${c.stage}`)
          .join("; ")}. Livestock: 348 animals, alerts for ${livestock
          .filter((a) => a.health !== "Healthy")
          .map((a) => a.tag)
          .join(", ")}. Be practical and concise, use headings and bullets.`,
        messages: next.slice(-10),
      },
    }).catch(() => null);
    setMessages([
      ...next,
      {
        role: "assistant",
        content: res?.ok
          ? res.text
          : (res?.error ?? "I couldn't reach the AI service just now. Please try again."),
      },
    ]);
    setLoading(false);
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <AppShell title="AI Assistant" subtitle="Your farm copilot across every module">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <div className="surface flex min-h-[55vh] flex-col gap-5 p-5">
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-3"}>
              {m.role === "assistant" && (
                <span className="gradient-crop mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl text-crop-foreground">
                  <Leaf className="size-4" />
                </span>
              )}
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[90%] whitespace-pre-wrap text-sm leading-relaxed text-foreground"
                }
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Thinking…
            </p>
          )}
          <div ref={endRef} />
        </div>

        <div className="flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {p}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="surface flex items-end gap-2 p-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={2}
            placeholder="Ask FarmFlow AI anything about your farm…"
            className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-60"
            aria-label="Send message"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </AppShell>
  );
}
