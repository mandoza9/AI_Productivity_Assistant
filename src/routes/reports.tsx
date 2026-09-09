import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { financeData, milkData, yieldData } from "@/lib/farm-data";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — FarmFlow AI Workplace" },
      {
        name: "description",
        content:
          "Crop yield, milk production, livestock health, expenses and revenue reports with PDF, Excel and email export.",
      },
      { property: "og:title", content: "Reports & Analytics — FarmFlow" },
      {
        property: "og:description",
        content: "Visual farm reports for yield, milk production, expenses and revenue.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <AppShell title="Reports & Analytics" subtitle="Season to date · April – September 2026">
      <div className="flex flex-wrap gap-2">
        {["Export PDF", "Export Excel", "Email report"].map((b) => (
          <button
            key={b}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft"
          >
            {b}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="surface p-5">
          <h2 className="text-lg font-semibold">Crop yield (t/ha)</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="maize" fill="var(--chart-1)" radius={6} />
                <Bar dataKey="soybean" fill="var(--chart-2)" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="text-lg font-semibold">Milk production (litres/week)</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={milkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="litres" stroke="var(--chart-1)" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5 xl:col-span-2">
          <h2 className="text-lg font-semibold">Revenue vs expenses (ZAR)</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip formatter={(v: number) => `R ${v.toLocaleString("en-ZA")}`} />
                <Legend />
                <Bar dataKey="revenue" fill="var(--chart-1)" radius={6} />
                <Bar dataKey="expenses" fill="var(--chart-2)" radius={6} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="text-lg font-semibold">Livestock health summary</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              { l: "Healthy animals", v: "341 of 348 (98%)" },
              { l: "Under treatment", v: "1 (ZA-2277)" },
              { l: "Monitoring", v: "1 (ZA-1088 mastitis check)" },
              { l: "Vaccination compliance", v: "94% of herd up to date" },
            ].map((r) => (
              <li key={r.l} className="flex justify-between rounded-lg bg-muted p-3">
                <span className="text-muted-foreground">{r.l}</span>
                <span className="font-semibold text-foreground">{r.v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface p-5">
          <h2 className="text-lg font-semibold">Season highlights</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Maize yield up 31% vs April baseline.</li>
            <li>Milk production up 19% over six weeks.</li>
            <li>Feed cost per litre down 6% after supplier renegotiation.</li>
            <li>Gross margin for September: R 212 000.</li>
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
