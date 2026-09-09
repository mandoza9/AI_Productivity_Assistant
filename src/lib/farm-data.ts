export type Priority = "high" | "medium" | "low";

export const farmer = { name: "Asiphile", farm: "Ubuhle Farms" };

export const kpis = [
  { label: "Tasks due today", value: "7", hint: "2 overdue", tone: "crop" as const },
  { label: "Upcoming events", value: "4", hint: "Next: vet visit", tone: "meeting" as const },
  { label: "Livestock count", value: "348", hint: "142 dairy cattle", tone: "livestock" as const },
  { label: "Crop progress", value: "68%", hint: "Maize flowering", tone: "crop" as const },
  { label: "Unread emails", value: "12", hint: "3 urgent", tone: "ai" as const },
];

export const weather = {
  place: "Howick, KZN",
  today: { temp: 24, condition: "Partly cloudy", rain: 20 },
  forecast: [
    { day: "Thu", temp: 26, condition: "Sunny", rain: 5 },
    { day: "Fri", temp: 22, condition: "Showers", rain: 70 },
    { day: "Sat", temp: 19, condition: "Rain", rain: 85 },
    { day: "Sun", temp: 23, condition: "Cloudy", rain: 30 },
    { day: "Mon", temp: 27, condition: "Sunny", rain: 10 },
  ],
};

export const dailySummary = [
  "Feed cattle at 06:00 — Camp 3 troughs still low",
  "Irrigate maize fields at 09:00 — rain expected Friday, shorten cycle",
  "Vet visit tomorrow 08:30 — prepare vaccination records for 12 heifers",
  "Approve feed supplier quotation before Friday cut-off",
  "Reply to 3 urgent emails (vet, feed invoice, co-op audit)",
];

export type Task = {
  id: string;
  title: string;
  time: string;
  priority: Priority;
  category: "Crops" | "Livestock" | "Meetings" | "Admin";
  done: boolean;
};

export const tasks: Task[] = [
  { id: "t1", title: "Feed livestock — Camp 1 to 4", time: "08:00", priority: "high", category: "Livestock", done: true },
  { id: "t2", title: "Irrigation cycle: maize block B", time: "09:30", priority: "high", category: "Crops", done: false },
  { id: "t3", title: "Equipment inspection — tractor & baler", time: "11:00", priority: "medium", category: "Admin", done: false },
  { id: "t4", title: "Staff meeting: harvest roster", time: "14:00", priority: "medium", category: "Meetings", done: false },
  { id: "t5", title: "Harvest planning for soybean block D", time: "16:00", priority: "low", category: "Crops", done: false },
  { id: "t6", title: "Order livestock feed from supplier", time: "Due Friday", priority: "high", category: "Admin", done: false },
  { id: "t7", title: "Book vet visit for heifer group", time: "Due 15 Sep", priority: "medium", category: "Livestock", done: false },
];

export type CalEvent = {
  id: string;
  day: number;
  title: string;
  time: string;
  type: "crop" | "livestock" | "meeting" | "ai";
};

export const events: CalEvent[] = [
  { id: "e1", day: 9, title: "Irrigate maize block B", time: "09:30", type: "crop" },
  { id: "e2", day: 9, title: "Staff meeting", time: "14:00", type: "meeting" },
  { id: "e3", day: 10, title: "Vet visit — heifers", time: "08:30", type: "livestock" },
  { id: "e4", day: 11, title: "AI: weekly plan review", time: "07:00", type: "ai" },
  { id: "e5", day: 12, title: "Feed delivery", time: "10:00", type: "livestock" },
  { id: "e6", day: 15, title: "Soybean harvest prep", time: "06:30", type: "crop" },
  { id: "e7", day: 18, title: "Co-op board meeting", time: "11:00", type: "meeting" },
  { id: "e8", day: 22, title: "Deworming round", time: "07:30", type: "livestock" },
  { id: "e9", day: 24, title: "AI: fertiliser recommendation", time: "08:00", type: "ai" },
  { id: "e10", day: 26, title: "Maize scouting walk", time: "16:00", type: "crop" },
];

export type Email = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  priority: "urgent" | "high" | "low" | "spam";
  category: string;
  time: string;
  read: boolean;
  suggestion: string;
};

export const emails: Email[] = [
  {
    id: "m1",
    from: "Dr. Naidoo — Mooi Vet",
    subject: "Vet appointment confirmation",
    preview: "Confirming tomorrow 08:30 for the heifer group vaccinations and pregnancy checks.",
    priority: "urgent",
    category: "Livestock health",
    time: "07:12",
    read: false,
    suggestion: "Confirm the 08:30 slot and attach the vaccination register for 12 heifers.",
  },
  {
    id: "m2",
    from: "AgriFeed Supplies",
    subject: "Feed supplier invoice — Q3",
    preview: "Please find attached invoice INV-20841 due within 7 days.",
    priority: "high",
    category: "Finance",
    time: "06:48",
    read: false,
    suggestion: "Acknowledge receipt, query the R2 340 delivery surcharge, confirm payment date.",
  },
  {
    id: "m3",
    from: "KZN Farmers Co-op",
    subject: "Audit documents required",
    preview: "We need your crop input records before the 20th to finalise the annual audit.",
    priority: "high",
    category: "Compliance",
    time: "Yesterday",
    read: false,
    suggestion: "Send the input register and ask whether irrigation logs are also required.",
  },
  {
    id: "m4",
    from: "SeedGrow Newsletter",
    subject: "New season hybrid maize trials",
    preview: "Trial results from 42 sites across South Africa.",
    priority: "low",
    category: "Newsletter",
    time: "Yesterday",
    read: true,
    suggestion: "No reply needed — save trial results to Research.",
  },
  {
    id: "m5",
    from: "unknown-sender-88",
    subject: "You have won a tractor!!!",
    preview: "Click here to claim your prize immediately.",
    priority: "spam",
    category: "Spam",
    time: "Mon",
    read: true,
    suggestion: "Blocked automatically — no action needed.",
  },
];

export type Animal = {
  id: string;
  tag: string;
  breed: string;
  age: string;
  health: "Healthy" | "Monitor" | "Treatment";
  nextAction: string;
  due: string;
};

export const livestock: Animal[] = [
  { id: "a1", tag: "ZA-1042", breed: "Holstein", age: "4 yrs", health: "Healthy", nextAction: "Vaccination", due: "10 Sep" },
  { id: "a2", tag: "ZA-1088", breed: "Jersey", age: "3 yrs", health: "Monitor", nextAction: "Mastitis check", due: "9 Sep" },
  { id: "a3", tag: "ZA-2210", breed: "Bonsmara", age: "2 yrs", health: "Healthy", nextAction: "Deworming", due: "22 Sep" },
  { id: "a4", tag: "ZA-2277", breed: "Nguni", age: "5 yrs", health: "Treatment", nextAction: "Vet follow-up", due: "10 Sep" },
  { id: "a5", tag: "ZA-3301", breed: "Dorper (sheep)", age: "1 yr", health: "Healthy", nextAction: "Breeding cycle", due: "1 Oct" },
];

export type Crop = {
  id: string;
  name: string;
  block: string;
  planted: string;
  stage: string;
  progress: number;
  harvest: string;
  irrigation: string;
};

export const crops: Crop[] = [
  { id: "c1", name: "Maize", block: "Block B — 24 ha", planted: "12 Nov", stage: "Flowering", progress: 68, harvest: "18 Apr", irrigation: "Every 3 days" },
  { id: "c2", name: "Soybean", block: "Block D — 16 ha", planted: "28 Nov", stage: "Pod fill", progress: 74, harvest: "2 Apr", irrigation: "Every 4 days" },
  { id: "c3", name: "Dryland wheat", block: "Block F — 30 ha", planted: "3 Jun", stage: "Tillering", progress: 32, harvest: "20 Nov", irrigation: "Rain-fed" },
  { id: "c4", name: "Cabbage", block: "Block A — 4 ha", planted: "1 Aug", stage: "Head forming", progress: 55, harvest: "12 Oct", irrigation: "Daily drip" },
];

export const cropAlerts = [
  { crop: "Maize", text: "Grey leaf spot risk high after Friday rain — scout Block B leaves.", tone: "warning" },
  { crop: "Soybean", text: "Harvest readiness in ~18 days; book contractor now.", tone: "info" },
  { crop: "Cabbage", text: "Apply nitrogen top dressing (LAN 28) within 5 days.", tone: "info" },
];

export const yieldData = [
  { month: "Apr", maize: 6.2, soybean: 2.4 },
  { month: "May", maize: 6.8, soybean: 2.6 },
  { month: "Jun", maize: 7.1, soybean: 2.9 },
  { month: "Jul", maize: 6.9, soybean: 3.1 },
  { month: "Aug", maize: 7.6, soybean: 3.3 },
  { month: "Sep", maize: 8.1, soybean: 3.5 },
];

export const milkData = [
  { week: "W1", litres: 4120 },
  { week: "W2", litres: 4380 },
  { week: "W3", litres: 4210 },
  { week: "W4", litres: 4610 },
  { week: "W5", litres: 4780 },
  { week: "W6", litres: 4930 },
];

export const financeData = [
  { month: "Apr", revenue: 412000, expenses: 288000 },
  { month: "May", revenue: 398000, expenses: 301000 },
  { month: "Jun", revenue: 455000, expenses: 312000 },
  { month: "Jul", revenue: 478000, expenses: 305000 },
  { month: "Aug", revenue: 512000, expenses: 331000 },
  { month: "Sep", revenue: 534000, expenses: 322000 },
];

export const reminders = [
  { channel: "Email", text: "Vet appointment tomorrow 08:30", when: "Sent 06:00" },
  { channel: "Push", text: "Vaccination due today for ZA-1042", when: "Sent 05:30" },
  { channel: "Dashboard", text: "Milking starts in one hour", when: "Live" },
  { channel: "Email", text: "Crop irrigation scheduled 09:30", when: "Sent 08:30" },
];
