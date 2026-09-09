import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkle } from "lucide-react";
import { useState } from "react";
import { askFarmAi } from "@/lib/ai.functions";

export function useFarmAi() {
  const ask = useServerFn(askFarmAi);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const run = async (prompt: string, system?: string) => {
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await ask({ data: { system, messages: [{ role: "user", content: prompt }] } });
      if (res.ok) setOutput(res.text);
      else setError(res.error);
    } catch {
      setError("The AI service could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, output, error, setOutput };
}

export function AiOutput({
  loading,
  output,
  error,
  empty,
}: {
  loading: boolean;
  output: string;
  error: string;
  empty: string;
}) {
  return (
    <div className="surface min-h-56 p-5">
      {loading && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> AI Workplace Assistant is working…
        </p>
      )}
      {!loading && error && (
        <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      )}
      {!loading && !error && !output && (
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <Sparkle className="mt-0.5 size-4 text-ai" /> {empty}
        </p>
      )}
      {!loading && output && (
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
          {output}
        </pre>
      )}
    </div>
  );
}
