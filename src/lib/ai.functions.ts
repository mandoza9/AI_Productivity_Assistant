import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

const AskInput = z.object({
  system: z.string().optional(),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
});

export const askFarmAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) {
      return { ok: false as const, error: "AI is not configured for this farm workspace yet." };
    }

    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const result = streamText({
        model: gateway("google/gemini-3.8-flash"),
        system:
          data.system ??
          "You are AI Workplace Assistant, an assistant for crop and livestock farm managers in South Africa. Be practical, concise and use clear headings and bullet points.",
        messages: data.messages,
      });
      const text = await result.text;
      return { ok: true as const, text };
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI request failed.";
      return { ok: false as const, error: message };
    }
  });
