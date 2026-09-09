import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — FarmFlow AI Workplace" },
      {
        name: "description",
        content:
          "Manage your farm profile, connected email and calendar accounts, and reminder channels in FarmFlow.",
      },
      { property: "og:title", content: "Settings — FarmFlow" },
      {
        property: "og:description",
        content: "Farm profile, integrations and reminder preferences.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [channels, setChannels] = useState({ email: true, dashboard: true, push: false });

  return (
    <AppShell title="Settings" subtitle="Farm profile, integrations and reminders">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface p-5">
          <h2 className="text-lg font-semibold">Farm profile</h2>
          <div className="mt-4 space-y-3">
            {[
              { l: "Farm name", v: "Ubuhle Farms" },
              { l: "Manager", v: "Asiphile Mdlebe" },
              { l: "Location", v: "Howick, KwaZulu-Natal" },
              { l: "Land under crops", v: "74 ha" },
            ].map((f) => (
              <label key={f.l} className="block">
                <span className="mb-1.5 block text-sm font-medium">{f.l}</span>
                <input defaultValue={f.v} className="input-base" />
              </label>
            ))}
          </div>
          <button className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground">
            Save profile
          </button>
        </section>

        <div className="space-y-5">
          <section className="surface p-5">
            <h2 className="text-lg font-semibold">Connected accounts</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {["Gmail", "Outlook / Microsoft 365", "Google Calendar", "Outlook Calendar"].map((a) => (
                <li key={a} className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span>{a}</span>
                  <button className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold">
                    Connect
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="surface p-5">
            <h2 className="text-lg font-semibold">Reminder channels</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {(
                [
                  ["email", "Email reminders"],
                  ["dashboard", "Dashboard alerts"],
                  ["push", "Mobile push notifications"],
                ] as const
              ).map(([key, label]) => (
                <li key={key} className="flex items-center justify-between rounded-lg bg-muted p-3">
                  <span>{label}</span>
                  <button
                    onClick={() => setChannels((c) => ({ ...c, [key]: !c[key] }))}
                    className={`h-6 w-11 rounded-full transition-colors ${channels[key] ? "bg-primary" : "bg-border"}`}
                    aria-label={label}
                  >
                    <span
                      className={`block size-5 rounded-full bg-card transition-transform ${channels[key] ? "translate-x-5" : "translate-x-0.5"}`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
