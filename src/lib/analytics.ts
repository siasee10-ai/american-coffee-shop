export type EventType = "visit" | "order" | "call" | "menu_explore" | "location_open";

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  title: string;
  detail: string;
  timestamp: string; // ISO string
  device: "Mobile" | "Desktop" | "Tablet";
  browser: "Chrome" | "Safari" | "Edge" | "Firefox" | "Other";
  meta?: Record<string, string | number>;
}

export interface DayTrend {
  date: string;
  day: string;
  visits: number;
  menuExplores: number;
  orders: number;
  calls: number;
  locations: number;
}

export type OrderStatus = "CONFIRMED" | "BUTTON_CLICKED";

export interface OrderItem {
  name: string;
  quantity: number;
  price?: string;
}

export interface OrderRecord {
  id: string; // e.g. "ACS-8392" or "CLK-1049"
  status: OrderStatus; // "CONFIRMED" (actually ordered) or "BUTTON_CLICKED" (clicked order link)
  platform: string; // "Direct Takeout", "Toast Tab", "Uber Eats", etc.
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount?: string;
  notes?: string;
  timestamp: string; // ISO string
  device: "Mobile" | "Desktop" | "Tablet";
  browser: "Chrome" | "Safari" | "Edge" | "Firefox" | "Other";
}

export interface AnalyticsData {
  totalVisits: number;
  uniqueVisitors: number;
  totalOrders: number; // Actually placed orders (Confirmed)
  totalOrderClicks: number; // Users who clicked an order button/link
  totalCalls: number;
  totalMenuExplores: number;
  totalLocationOpens: number;
  ordersByPlatform: Record<string, number>;
  menuByTab: Record<string, number>;
  topDishesClicked: Record<string, number>;
  dailyTrends: DayTrend[];
  events: AnalyticsEvent[];
  ordersList: OrderRecord[];
}

const STORAGE_KEY = "acs_analytics_telemetry_v2";

function detectDevice(): "Mobile" | "Desktop" | "Tablet" {
  if (typeof window === "undefined" || !navigator) return "Desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
    return "Tablet";
  }
  if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds)/.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

function detectBrowser(): "Chrome" | "Safari" | "Edge" | "Firefox" | "Other" {
  if (typeof window === "undefined" || !navigator) return "Chrome";
  const ua = navigator.userAgent;
  if (/edg/i.test(ua)) return "Edge";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Other";
}

// Generate clean, completely cleared initial data with zero metrics
export function generateEmptyData(): AnalyticsData {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = [
    "Sep 29", "Sep 30", "Oct 01", "Oct 02", "Oct 03", "Oct 04", "Oct 05"
  ];

  const dailyTrends: DayTrend[] = dates.map((date, idx) => ({
    date,
    day: days[idx] || "Mon",
    visits: 0,
    menuExplores: 0,
    orders: 0,
    calls: 0,
    locations: 0,
  }));

  return {
    totalVisits: 0,
    uniqueVisitors: 0,
    totalOrders: 0,
    totalOrderClicks: 0,
    totalCalls: 0,
    totalMenuExplores: 0,
    totalLocationOpens: 0,
    ordersByPlatform: {},
    menuByTab: {},
    topDishesClicked: {},
    dailyTrends,
    events: [],
    ordersList: [],
  };
}

export function loadAnalyticsData(): AnalyticsData {
  if (typeof window === "undefined") {
    return generateEmptyData();
  }
  try {
    // Clear old versions
    localStorage.removeItem("acs_analytics_telemetry_v1");
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = generateEmptyData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.ordersList) parsed.ordersList = [];
    if (typeof parsed.totalOrderClicks !== "number") parsed.totalOrderClicks = 0;
    return parsed;
  } catch (err) {
    console.error("Failed to load analytics data:", err);
    return generateEmptyData();
  }
}

function saveAnalyticsData(data: AnalyticsData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("acs_analytics_updated", { detail: data }));
  } catch (err) {
    console.error("Failed to save analytics data:", err);
  }
}

// Live viewers count (starts at 0 when cleared, increments if active)
export function getLiveViewersCount(): number {
  if (typeof window === "undefined") return 0;
  const active = sessionStorage.getItem("acs_session_active");
  return active ? 1 : 0;
}

// Track a website page visit / session
export function trackVisit() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("acs_session_active", "1");
  const isVisitedKey = "acs_session_visited_" + new Date().toDateString();
  const isNewToday = !sessionStorage.getItem(isVisitedKey);
  sessionStorage.setItem(isVisitedKey, "1");

  const data = loadAnalyticsData();
  data.totalVisits += 1;
  if (isNewToday) {
    data.uniqueVisitors += 1;
  }

  // Update today's entry in daily trends
  const todayEntry = data.dailyTrends[data.dailyTrends.length - 1];
  if (todayEntry) {
    todayEntry.visits += 1;
  }

  // Add event log
  const newEvt: AnalyticsEvent = {
    id: "evt-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    type: "visit",
    title: "Website Visit Recorded",
    detail: "Customer landed on American Coffee Shop homepage",
    timestamp: new Date().toISOString(),
    device: detectDevice(),
    browser: detectBrowser(),
  };

  data.events.unshift(newEvt);
  if (data.events.length > 100) data.events.pop();

  saveAnalyticsData(data);
}

// Track when a customer clicks the Order Online button or an external partner link (intent)
export function trackOrderClick(platform: string = "Toast Tab", detail?: string) {
  if (typeof window === "undefined") return;
  const data = loadAnalyticsData();
  data.totalOrderClicks = (data.totalOrderClicks || 0) + 1;
  data.ordersByPlatform[platform] = (data.ordersByPlatform[platform] || 0) + 1;

  const orderRecord: OrderRecord = {
    id: "CLK-" + Math.floor(1000 + Math.random() * 9000),
    status: "BUTTON_CLICKED",
    platform,
    customerName: "Website Visitor",
    customerPhone: "Not Provided (Clicked Out)",
    items: [{ name: detail || `${platform} Button Clicked`, quantity: 1, price: "N/A" }],
    totalAmount: "N/A (Checkout Link Clicked)",
    notes: detail || `Customer clicked to open ${platform} ordering page`,
    timestamp: new Date().toISOString(),
    device: detectDevice(),
    browser: detectBrowser(),
  };

  data.ordersList.unshift(orderRecord);
  if (data.ordersList.length > 100) data.ordersList.pop();

  const newEvt: AnalyticsEvent = {
    id: "evt-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    type: "order",
    title: `Order Button Clicked: ${platform}`,
    detail: detail || `Customer clicked to order via ${platform} (Initiated Checkout)`,
    timestamp: new Date().toISOString(),
    device: detectDevice(),
    browser: detectBrowser(),
    meta: { platform, status: "BUTTON_CLICKED" },
  };

  data.events.unshift(newEvt);
  if (data.events.length > 100) data.events.pop();

  saveAnalyticsData(data);
  return orderRecord;
}

// Track when a customer ACTUALLY completes and places an order
export function trackOrderConfirmed(orderInfo: {
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: string;
  notes?: string;
  platform?: string;
}) {
  if (typeof window === "undefined") return;
  const data = loadAnalyticsData();
  data.totalOrders = (data.totalOrders || 0) + 1;
  const platform = orderInfo.platform || "Direct Takeout";
  data.ordersByPlatform[platform] = (data.ordersByPlatform[platform] || 0) + 1;

  const todayEntry = data.dailyTrends[data.dailyTrends.length - 1];
  if (todayEntry) {
    todayEntry.orders += 1;
  }

  const orderId = "ACS-" + Math.floor(1000 + Math.random() * 9000);

  const orderRecord: OrderRecord = {
    id: orderId,
    status: "CONFIRMED",
    platform,
    customerName: orderInfo.customerName || "Customer",
    customerPhone: orderInfo.customerPhone || "Not Provided",
    items: orderInfo.items,
    totalAmount: orderInfo.totalAmount,
    notes: orderInfo.notes || "Counter Pickup Takeout Order",
    timestamp: new Date().toISOString(),
    device: detectDevice(),
    browser: detectBrowser(),
  };

  data.ordersList.unshift(orderRecord);
  if (data.ordersList.length > 100) data.ordersList.pop();

  const itemsSummary = orderInfo.items.map((i) => `${i.name} (x${i.quantity})`).join(", ");

  const newEvt: AnalyticsEvent = {
    id: "evt-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    type: "order",
    title: `Confirmed Order Placed (#${orderId})`,
    detail: `${orderInfo.customerName} (${orderInfo.customerPhone}) ordered ${itemsSummary} · Total: ${orderInfo.totalAmount}`,
    timestamp: new Date().toISOString(),
    device: detectDevice(),
    browser: detectBrowser(),
    meta: {
      orderId,
      customerName: orderInfo.customerName,
      totalAmount: orderInfo.totalAmount,
      status: "CONFIRMED",
    },
  };

  data.events.unshift(newEvt);
  if (data.events.length > 100) data.events.pop();

  saveAnalyticsData(data);
  return orderRecord;
}

// Backwards-compatible alias for order button clicks
export function trackOrder(platform: string = "Toast Tab", detail?: string) {
  return trackOrderClick(platform, detail);
}

// Track when a user clicks a phone link
export function trackCall(section: string = "Direct Call") {
  if (typeof window === "undefined") return;
  const data = loadAnalyticsData();
  data.totalCalls += 1;

  const todayEntry = data.dailyTrends[data.dailyTrends.length - 1];
  if (todayEntry) {
    todayEntry.calls += 1;
  }

  const newEvt: AnalyticsEvent = {
    id: "evt-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    type: "call",
    title: "Phone Call Placed",
    detail: `Dialed +1 (954) 772-8850 from ${section}`,
    timestamp: new Date().toISOString(),
    device: detectDevice(),
    browser: detectBrowser(),
    meta: { section },
  };

  data.events.unshift(newEvt);
  if (data.events.length > 100) data.events.pop();

  saveAnalyticsData(data);
}

// Track when a user explores the menu or clicks a dish
export function trackMenuExplore(tabOrDish: string, detail?: string) {
  if (typeof window === "undefined") return;
  const data = loadAnalyticsData();
  data.totalMenuExplores += 1;

  if (tabOrDish) {
    const tabLower = tabOrDish.toLowerCase();
    if (tabLower.includes("breakfast")) {
      data.menuByTab["Breakfast Classics"] = (data.menuByTab["Breakfast Classics"] || 0) + 1;
    } else if (tabLower.includes("lunch") || tabLower.includes("sandwich")) {
      data.menuByTab["Pressed Sandwiches & Lunch"] = (data.menuByTab["Pressed Sandwiches & Lunch"] || 0) + 1;
    } else if (tabLower.includes("drink") || tabLower.includes("bar")) {
      data.menuByTab["Cuban Coffee & Drinks"] = (data.menuByTab["Cuban Coffee & Drinks"] || 0) + 1;
    } else if (tabLower.includes("spanish")) {
      data.menuByTab["Spanish Specials"] = (data.menuByTab["Spanish Specials"] || 0) + 1;
    } else {
      data.topDishesClicked[tabOrDish] = (data.topDishesClicked[tabOrDish] || 0) + 1;
    }
  }

  const todayEntry = data.dailyTrends[data.dailyTrends.length - 1];
  if (todayEntry) {
    todayEntry.menuExplores += 1;
  }

  const newEvt: AnalyticsEvent = {
    id: "evt-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    type: "menu_explore",
    title: `Menu Explored: ${tabOrDish}`,
    detail: detail || `Customer opened and explored ${tabOrDish} section`,
    timestamp: new Date().toISOString(),
    device: detectDevice(),
    browser: detectBrowser(),
    meta: { tabOrDish },
  };

  data.events.unshift(newEvt);
  if (data.events.length > 100) data.events.pop();

  saveAnalyticsData(data);
}

// Track when a user opens directions or location
export function trackLocationOpen(source: string = "Google Maps") {
  if (typeof window === "undefined") return;
  const data = loadAnalyticsData();
  data.totalLocationOpens += 1;

  const todayEntry = data.dailyTrends[data.dailyTrends.length - 1];
  if (todayEntry) {
    todayEntry.locations += 1;
  }

  const newEvt: AnalyticsEvent = {
    id: "evt-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    type: "location_open",
    title: "Location & Directions Opened",
    detail: `Customer requested directions to 41 NE 44th St via ${source}`,
    timestamp: new Date().toISOString(),
    device: detectDevice(),
    browser: detectBrowser(),
    meta: { source },
  };

  data.events.unshift(newEvt);
  if (data.events.length > 100) data.events.pop();

  saveAnalyticsData(data);
}

// Reset analytics telemetry back to clean zero state
export function resetAnalyticsData(): AnalyticsData {
  const initial = generateEmptyData();
  if (typeof window !== "undefined") {
    localStorage.removeItem("acs_analytics_telemetry_v1");
    localStorage.removeItem("acs_analytics_telemetry_v2");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    sessionStorage.removeItem("acs_session_active");
    const today = new Date().toDateString();
    sessionStorage.removeItem("acs_session_visited_" + today);
    window.dispatchEvent(new CustomEvent("acs_analytics_updated", { detail: initial }));
  }
  return initial;
}

// Export analytics data as JSON
export function exportAnalyticsJSON() {
  if (typeof window === "undefined") return;
  const data = loadAnalyticsData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `american-coffee-shop-analytics-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export events log as CSV
export function exportAnalyticsCSV() {
  if (typeof window === "undefined") return;
  const data = loadAnalyticsData();
  const headers = ["ID", "Timestamp", "Type", "Title", "Detail", "Device", "Browser"];
  const rows = data.events.map((e) => [
    `"${e.id}"`,
    `"${e.timestamp}"`,
    `"${e.type}"`,
    `"${e.title.replace(/"/g, '""')}"`,
    `"${e.detail.replace(/"/g, '""')}"`,
    `"${e.device}"`,
    `"${e.browser}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `american-coffee-shop-events-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Export orders as CSV
export function exportOrdersCSV() {
  if (typeof window === "undefined") return;
  const data = loadAnalyticsData();
  const headers = [
    "Order ID",
    "Status (Actually Ordered vs Button Clicked)",
    "Customer Name",
    "Customer Phone",
    "Platform / Source",
    "Items & Quantities",
    "Total Amount",
    "Notes",
    "Date & Time",
    "Device",
    "Browser",
  ];
  const rows = (data.ordersList || []).map((o) => [
    `"${o.id}"`,
    `"${o.status === "CONFIRMED" ? "ACTUALLY ORDERED (Confirmed)" : "BUTTON CLICKED ONLY (Checkout Intent)"}"`,
    `"${(o.customerName || "N/A").replace(/"/g, '""')}"`,
    `"${(o.customerPhone || "N/A").replace(/"/g, '""')}"`,
    `"${(o.platform || "Direct").replace(/"/g, '""')}"`,
    `"${(o.items || []).map((i) => `${i.name} (x${i.quantity})`).join("; ").replace(/"/g, '""')}"`,
    `"${(o.totalAmount || "N/A").replace(/"/g, '""')}"`,
    `"${(o.notes || "").replace(/"/g, '""')}"`,
    `"${o.timestamp}"`,
    `"${o.device}"`,
    `"${o.browser}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `american-coffee-shop-orders-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Helper to create a realistic sample order for demonstration in Admin Panel
export function createSampleOrder(isActuallyOrdered: boolean = true) {
  if (isActuallyOrdered) {
    const sampleNames = ["Maria Gonzalez", "David Miller", "Carlos Rodriguez", "Elena Vance", "Marcus Sterling"];
    const samplePhones = ["(954) 555-0142", "(954) 555-8391", "(305) 555-4820", "(954) 555-7201", "(954) 555-3184"];
    const sampleDishes = [
      { name: "Famous Cuban Sandwich", price: "$10.50" },
      { name: "Colada (Cuban Espresso 4-Shot)", price: "$2.75" },
      { name: "Pan Con Bistec (Steak Sandwich)", price: "$11.95" },
      { name: "Cafe Con Leche (Large)", price: "$3.75" },
      { name: "Traditional 2-Egg Breakfast with Toast", price: "$8.50" },
      { name: "Beef & Cheese Empanadas (2 pcs)", price: "$6.50" },
    ];

    const idx = Math.floor(Math.random() * sampleNames.length);
    const defaultDish = { name: "Famous Cuban Sandwich", price: "$10.50" };
    const dish1 = sampleDishes[Math.floor(Math.random() * sampleDishes.length)] ?? defaultDish;
    const dish2 = sampleDishes[Math.floor(Math.random() * sampleDishes.length)] ?? defaultDish;
    const items: OrderItem[] = [
      { name: dish1.name, quantity: 1, price: dish1.price },
      { name: dish2.name, quantity: 2, price: dish2.price },
    ];

    return trackOrderConfirmed({
      customerName: sampleNames[idx] || "Maria Gonzalez",
      customerPhone: samplePhones[idx] || "(954) 555-0142",
      items,
      totalAmount: "$24.50",
      notes: "Please pack hot sauce and extra napkins. Pick up in 15 mins.",
      platform: "Direct Takeout (Counter)",
    });
  } else {
    const platforms = ["Toast Tab (Direct)", "Uber Eats", "Grubhub", "Toast Mobile App", "Postmates"];
    const chosen = platforms[Math.floor(Math.random() * platforms.length)];
    return trackOrderClick(chosen, `Visitor clicked ${chosen} checkout button on menu modal`);
  }
}
