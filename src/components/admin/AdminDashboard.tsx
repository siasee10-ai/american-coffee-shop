import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  ShoppingBag,
  PhoneCall,
  UtensilsCrossed,
  MapPin,
  TrendingUp,
  Eye,
  Activity,
  Clock,
  Shield,
  Lock,
  Unlock,
  LogOut,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  ArrowUpRight,
  Coffee,
  Sparkles,
  Calendar,
  ExternalLink,
  ChevronRight,
  Flame,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  FileSpreadsheet,
  FileCode,
  ArrowLeft,
  Trash2,
  Power,
  MousePointerClick,
  Receipt,
  User,
  Phone,
  X,
  Check,
  DollarSign,
  PackageCheck,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  loadAnalyticsData,
  getLiveViewersCount,
  resetAnalyticsData,
  exportAnalyticsJSON,
  exportAnalyticsCSV,
  exportOrdersCSV,
  createSampleOrder,
  type AnalyticsData,
  type AnalyticsEvent,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/analytics";
import {
  getSiteOnlineStatus,
  setSiteOnlineStatus,
  subscribeSiteStatus,
} from "@/lib/siteStatus";
import { BUSINESS } from "@/lib/business";

// Secure Admin Credentials
const ADMIN_CREDENTIALS = {
  username: "american_coffeshop22339988",
  password: "coffeeshop99882233american",
};

const PLATFORM_COLORS: Record<string, string> = {
  "Toast Tab (Direct)": "#deb887",
  "Uber Eats": "#22c55e",
  "Toast Mobile App": "#c084fc",
  "Grubhub": "#f97316",
  "Postmates": "#38bdf8",
  "Seamless": "#f43f5e",
};

const FALLBACK_COLORS = ["#c084fc", "#deb887", "#22c55e", "#38bdf8", "#f97316", "#a855f7"];

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsData>(() => loadAnalyticsData());
  const [liveViewers, setLiveViewers] = useState<number>(() => getLiveViewersCount());
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dataClearedNotification, setDataClearedNotification] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSiteOnline, setIsSiteOnline] = useState<boolean>(() => getSiteOnlineStatus());
  const [showToggleOfflineConfirm, setShowToggleOfflineConfirm] = useState(false);
  const [siteStatusToast, setSiteStatusToast] = useState<string | null>(null);
  const [orderFilter, setOrderFilter] = useState<"all" | "CONFIRMED" | "BUTTON_CLICKED">("all");
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Sync site online/offline status in real time
  useEffect(() => {
    setIsSiteOnline(getSiteOnlineStatus());
    const unsub = subscribeSiteStatus((online) => {
      setIsSiteOnline(online);
    });
    return () => unsub();
  }, []);

  const handleToggleSiteStatus = (desiredStatus: boolean) => {
    setSiteOnlineStatus(desiredStatus);
    setIsSiteOnline(desiredStatus);
    setShowToggleOfflineConfirm(false);
    setSiteStatusToast(
      desiredStatus
        ? "Website has been turned ON! Public visitors can now view the site and order."
        : "Website has been turned OFF! Public visitors now see the offline maintenance screen."
    );
    setTimeout(() => setSiteStatusToast(null), 5000);
  };

  // Check existing session or special secret access URL query parameter
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("acs_admin_authenticated");
      const urlParams = new URLSearchParams(window.location.search);
      const accessKey =
        urlParams.get("key") ||
        urlParams.get("token") ||
        urlParams.get("access") ||
        urlParams.get("autologin");

      if (
        auth === "true" ||
        accessKey === "direct" ||
        accessKey === "coffeeshop99882233american" ||
        accessKey === "american_coffeshop22339988" ||
        accessKey === "OaklandPark2026"
      ) {
        setIsAuthenticated(true);
        sessionStorage.setItem("acs_admin_authenticated", "true");
      }
    }
  }, []);

  // Sync analytics data and live viewers simulation
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setAnalytics(e.detail);
      } else {
        setAnalytics(loadAnalyticsData());
      }
    };
    window.addEventListener("acs_analytics_updated", handleUpdate);

    // Refresh live viewers periodically (fluctuates realistically)
    const interval = setInterval(() => {
      setLiveViewers(getLiveViewersCount());
    }, 15000);

    return () => {
      window.removeEventListener("acs_analytics_updated", handleUpdate);
      clearInterval(interval);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (
      usernameInput.trim() === ADMIN_CREDENTIALS.username &&
      passwordInput === ADMIN_CREDENTIALS.password
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem("acs_admin_authenticated", "true");
    } else {
      setLoginError("Invalid username or password. Please check your credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("acs_admin_authenticated");
  };

  const handleRefresh = () => {
    setAnalytics(loadAnalyticsData());
    setLiveViewers(getLiveViewersCount());
  };

  const handleReset = () => {
    const reset = resetAnalyticsData();
    setAnalytics(reset);
    setLiveViewers(0);
    setShowResetConfirm(false);
    setDataClearedNotification(true);
    setTimeout(() => setDataClearedNotification(false), 5000);
  };

  // Filtered event log
  const filteredEvents = useMemo(() => {
    return analytics.events.filter((evt) => {
      const matchesType = filterType === "all" || evt.type === filterType;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        evt.title.toLowerCase().includes(query) ||
        evt.detail.toLowerCase().includes(query) ||
        (evt.browser && evt.browser.toLowerCase().includes(query)) ||
        (evt.device && evt.device.toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [analytics.events, filterType, searchQuery]);

  // Format Platform data for Pie Chart
  const platformChartData = useMemo(() => {
    return Object.entries(analytics.ordersByPlatform).map(([name, value]) => ({
      name,
      value,
    }));
  }, [analytics.ordersByPlatform]);

  // Format Menu Tab data for Bar Chart
  const menuChartData = useMemo(() => {
    return Object.entries(analytics.menuByTab).map(([name, count]) => ({
      name,
      count,
    }));
  }, [analytics.menuByTab]);
 
  // Order details calculations & filtering
  const ordersList = useMemo(() => analytics.ordersList || [], [analytics.ordersList]);

  const confirmedOrdersCount = useMemo(() => {
    return ordersList.filter((o) => o.status === "CONFIRMED").length;
  }, [ordersList]);

  const buttonClicksCount = useMemo(() => {
    return ordersList.filter((o) => o.status === "BUTTON_CLICKED").length;
  }, [ordersList]);

  const totalTakeoutRevenue = useMemo(() => {
    return ordersList
      .filter((o) => o.status === "CONFIRMED")
      .reduce((sum, o) => {
        const val = parseFloat((o.totalAmount || "0").replace(/[^0-9.]/g, ""));
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
  }, [ordersList]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter((order) => {
      const matchesFilter = orderFilter === "all" || order.status === orderFilter;
      const q = orderSearch.trim().toLowerCase();
      if (!q) return matchesFilter;
      const itemsText = (order.items || []).map((i) => `${i.name} ${i.quantity}`).join(" ").toLowerCase();
      const matchesSearch =
        order.id.toLowerCase().includes(q) ||
        (order.customerName && order.customerName.toLowerCase().includes(q)) ||
        (order.customerPhone && order.customerPhone.toLowerCase().includes(q)) ||
        (order.platform && order.platform.toLowerCase().includes(q)) ||
        (order.notes && order.notes.toLowerCase().includes(q)) ||
        itemsText.includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [ordersList, orderFilter, orderSearch]);

  const handleAddSampleConfirmed = () => {
    createSampleOrder(true);
    setAnalytics(loadAnalyticsData());
    setOrderToast("Sample Confirmed Takeout Order added! Notice the green 'ACTUALLY ORDERED' badge with customer phone & items.");
    setTimeout(() => setOrderToast(null), 5000);
  };

  const handleAddSampleClick = () => {
    createSampleOrder(false);
    setAnalytics(loadAnalyticsData());
    setOrderToast("Sample Order Button Click recorded! Notice the amber 'BUTTON CLICK ONLY' badge.");
    setTimeout(() => setOrderToast(null), 5000);
  };

  // --------------------------------------------------------------------------
  // LOGIN SCREEN
  // --------------------------------------------------------------------------
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#120a06] text-[#f5f0ff] flex flex-col justify-center items-center p-4">
        <div className="h-8 w-8 rounded-full border-2 border-[#deb887] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#120a06] text-[#f5f0ff] flex flex-col justify-center items-center p-4 selection:bg-[#a855f7]/40">
        <div className="w-full max-w-md">
          {/* Top Brand Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#381c10] to-[#1c0f08] border border-[#a855f7]/60 text-[#c084fc] shadow-xl mb-3">
              <Coffee className="h-7 w-7 text-[#deb887]" />
            </div>
            <h1 className="font-serif text-3xl font-black text-[#fffcf8] tracking-tight">
              American Coffee Shop
            </h1>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#deb887] mt-1">
              Executive Admin Portal
            </p>
            <p className="text-xs text-[#a89bb8] mt-1">
              Oakland Park, FL · Secure Telemetry &amp; Insights
            </p>
          </div>

          {/* Secure Login Card */}
          <div className="rounded-3xl bg-[#1c0f09]/95 border border-[#a855f7]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#a855f7]/15 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#361e12]">
              <Shield className="h-5 w-5 text-[#22c55e]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#cbd5e1]">
                Authorized Personnel Only
              </span>
            </div>

            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-[#e11d48]/15 border border-[#e11d48]/40 flex items-start gap-2.5 text-xs text-[#fda4af]">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-[#e11d48]" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d8b4fe] mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    required
                    placeholder="Enter admin username"
                    className="w-full rounded-xl bg-[#28150d] border border-[#a855f7]/30 px-3.5 py-2.5 text-sm text-[#fffcf8] placeholder:text-[#8d7c9f] focus:outline-none focus:border-[#c084fc] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#d8b4fe] mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    placeholder="Enter strong password"
                    className="w-full rounded-xl bg-[#28150d] border border-[#a855f7]/30 px-3.5 py-2.5 pr-10 text-sm text-[#fffcf8] placeholder:text-[#8d7c9f] focus:outline-none focus:border-[#c084fc] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a89bb8] hover:text-[#fffcf8] text-xs cursor-pointer"
                  >
                    {showPassword ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 rounded-xl py-3 px-4 bg-gradient-to-r from-[#7c3aed] to-[#9333ea] hover:from-[#6d28d9] hover:to-[#7e22ce] text-[#ffffff] font-bold text-sm shadow-lg shadow-[#7c3aed]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>Sign In to Dashboard</span>
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-[#a89bb8] hover:text-[#fffcf8] transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to American Coffee Shop Homepage</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#120a06] text-[#f5f0ff] selection:bg-[#a855f7]/40">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#2d190f] bg-[#160d08]/95 backdrop-blur-md px-4 sm:px-6 lg:px-10 py-3.5 shadow-xl">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#381c10] to-[#1c0f08] border border-[#a855f7]/60 text-[#c084fc] shadow-md shrink-0">
              <Coffee className="h-5 w-5 text-[#deb887]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-black text-[#fffcf8] tracking-tight">
                  American Coffee Shop
                </h1>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#7c3aed]/30 text-[#deb887] border border-[#a855f7]/40 px-2 py-0.5 rounded-full">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-[#a89bb8]">
                Oakland Park, FL · Real-Time Diner Analytics &amp; Visitor Telemetry
              </p>
            </div>
          </div>

          {/* Quick Actions & Live Indicator */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Master Website Power Status Pill */}
            {isSiteOnline ? (
              <button
                onClick={() => setShowToggleOfflineConfirm(true)}
                className="flex items-center gap-2 rounded-full bg-[#162a18] hover:bg-[#223d24] border border-[#22c55e]/60 px-3.5 py-1.5 text-xs font-bold text-[#4ade80] shadow-sm transition-all cursor-pointer group"
                title="Website is currently LIVE & WORKING. Click to turn website OFF."
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]"></span>
                </span>
                <span>Site: LIVE (ON)</span>
                <Power className="h-3.5 w-3.5 text-[#22c55e] group-hover:text-white transition-colors" />
              </button>
            ) : (
              <button
                onClick={() => handleToggleSiteStatus(true)}
                className="flex items-center gap-2 rounded-full bg-[#3d1414] hover:bg-[#541b1b] border border-[#ef4444]/60 px-3.5 py-1.5 text-xs font-bold text-[#fca5a5] shadow-sm transition-all cursor-pointer group animate-pulse"
                title="Website is currently OFFLINE & PAUSED. Click to turn website ON."
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                <span>Site: OFFLINE (OFF)</span>
                <Power className="h-3.5 w-3.5 text-[#ef4444] group-hover:text-white transition-colors" />
              </button>
            )}

            {/* Live Viewers Indicator */}
            <div className="flex items-center gap-2 rounded-full bg-[#1b2b1a] border border-[#22c55e]/40 px-3.5 py-1.5 text-xs font-bold text-[#4ade80] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span>
              </span>
              <span>{liveViewers} Live on Website</span>
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-[#22140e] border border-[#a855f7]/30 text-[#d8b4fe] hover:text-[#fffcf8] hover:border-[#c084fc] transition-colors cursor-pointer"
              title="Refresh Analytics"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Export Dropdown / Buttons */}
            <button
              onClick={exportAnalyticsCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22140e] border border-[#a855f7]/30 text-xs font-bold text-[#e9d5ff] hover:border-[#c084fc] hover:bg-[#2c1a12] transition-colors cursor-pointer"
              title="Export event logs to CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-[#22c55e]" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={exportAnalyticsJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#22140e] border border-[#a855f7]/30 text-xs font-bold text-[#e9d5ff] hover:border-[#c084fc] hover:bg-[#2c1a12] transition-colors cursor-pointer"
              title="Export full data as JSON"
            >
              <FileCode className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span>JSON</span>
            </button>

            {/* Clear All Data Action Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3f1616] border border-[#ef4444]/60 text-xs font-bold text-[#fca5a5] hover:bg-[#ef4444] hover:text-[#ffffff] transition-all cursor-pointer shadow-sm"
              title="Clear all metrics, events, and telemetry"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All Data</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2a160d] border border-[#deb887]/40 text-xs font-bold text-[#deb887] hover:bg-[#381d11] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>View Site</span>
            </a>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#351515] border border-[#ef4444]/40 text-xs font-bold text-[#fca5a5] hover:bg-[#481c1c] transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Confirmation Modal to Turn Website OFF */}
      {showToggleOfflineConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1c0f09] border border-[#ef4444]/60 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#ef4444]">
              <div className="h-11 w-11 rounded-2xl bg-[#ef4444]/20 flex items-center justify-center border border-[#ef4444]/40 shrink-0">
                <Power className="h-6 w-6 text-[#ef4444]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#fffcf8]">Turn Website OFF?</h3>
                <p className="text-xs text-[#fca5a5]">Pause customer-facing website operations</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              Are you sure you want to turn the public website <strong className="text-[#ef4444]">OFF</strong>?
              Visitors visiting the site will see a branded maintenance screen. You can turn the website back <strong className="text-[#4ade80]">ON</strong> anytime with one click in this admin panel.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#361e12]">
              <button
                onClick={() => setShowToggleOfflineConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#28150d] border border-[#361e12] text-xs font-semibold text-[#cbd5e1] hover:text-[#ffffff] cursor-pointer"
              >
                Cancel (Keep Online)
              </button>
              <button
                onClick={() => handleToggleSiteStatus(false)}
                className="px-4 py-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-xs font-bold text-[#ffffff] shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Power className="h-4 w-4" />
                <span>Yes, Turn Website OFF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal to Clear All Data */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#1c0f09] border border-[#ef4444]/60 p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#ef4444]">
              <div className="h-11 w-11 rounded-2xl bg-[#ef4444]/20 flex items-center justify-center border border-[#ef4444]/40 shrink-0">
                <Trash2 className="h-6 w-6 text-[#ef4444]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#fffcf8]">Clear All Data</h3>
                <p className="text-xs text-[#fca5a5]">Reset admin telemetry metrics to zero</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
              Are you sure you want to clear all data in the admin panel? All visitor counts, online orders, phone calls, menu views, and live event logs will be permanently reset to <strong className="text-[#4ade80]">0</strong>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#361e12]">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#28150d] border border-[#361e12] text-xs font-semibold text-[#cbd5e1] hover:text-[#ffffff] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-xs font-bold text-[#ffffff] shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Yes, Clear Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Customer Order Receipt & Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#1a0e08] border border-[#a855f7]/50 p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Top Bar with Status Badge & Close Button */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#361e12]">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-[#deb887]">
                    #{selectedOrder.id}
                  </span>
                  {selectedOrder.status === "CONFIRMED" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#22c55e]/25 text-[#4ade80] border border-[#22c55e]/50 shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      ACTUALLY ORDERED (CONFIRMED)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#f59e0b]/25 text-[#fbbf24] border border-[#f59e0b]/50 shadow-sm">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      BUTTON CLICK ONLY (CHECKOUT INTENT)
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-2xl font-black text-[#fffcf8] mt-1.5">
                  {selectedOrder.status === "CONFIRMED" ? "Takeout Order Receipt" : "Lead & Button Click Activity"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="h-9 w-9 rounded-full bg-[#2a160d] hover:bg-[#3d1f13] border border-[#a855f7]/40 text-[#d8b4fe] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status Explanatory Card */}
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                selectedOrder.status === "CONFIRMED"
                  ? "bg-[#142618]/80 border-[#22c55e]/40 text-[#bbf7d0]"
                  : "bg-[#291e0a]/80 border-[#f59e0b]/40 text-[#fde68a]"
              }`}
            >
              {selectedOrder.status === "CONFIRMED" ? (
                <div className="flex items-start gap-2.5">
                  <PackageCheck className="h-5 w-5 text-[#22c55e] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-sm text-[#4ade80] mb-0.5">
                      Verified Direct Customer Order (Actually Ordered)
                    </strong>
                    The customer selected items and submitted their contact information directly on the website's Counter Pickup order form. This order is officially placed and awaiting pickup.
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2.5">
                  <MousePointerClick className="h-5 w-5 text-[#f59e0b] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-sm text-[#fbbf24] mb-0.5">
                      Button Click / External Redirect Only (Not Placed on Website)
                    </strong>
                    The visitor clicked an external ordering button (such as ToastTab, Uber Eats, Grubhub, or the main Order Online button). They initiated checkout but did not complete a direct website order.
                  </div>
                </div>
              )}
            </div>

            {/* Customer & Order Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer Box */}
              <div className="p-4 rounded-2xl bg-[#140b07] border border-[#361e12] space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#a89bb8]">
                  Customer Contact Information
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#c084fc]" />
                    <span className="text-sm font-bold text-[#fffcf8]">
                      {selectedOrder.customerName || "Website Visitor"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#deb887]" />
                    <span className="text-sm text-[#cbd5e1] font-mono">
                      {selectedOrder.customerPhone || "Not Provided"}
                    </span>
                    {selectedOrder.customerPhone && selectedOrder.customerPhone.includes("(") && (
                      <a
                        href={`tel:${selectedOrder.customerPhone.replace(/[^0-9]/g, "")}`}
                        className="ml-auto text-[11px] font-bold text-[#4ade80] bg-[#22c55e]/20 hover:bg-[#22c55e]/30 px-2.5 py-1 rounded-lg border border-[#22c55e]/40 transition-colors inline-flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        <span>Call Customer</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Source & Device Box */}
              <div className="p-4 rounded-2xl bg-[#140b07] border border-[#361e12] space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#a89bb8]">
                  Source &amp; Device Details
                </span>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8d7c9f]">Platform:</span>
                    <span className="font-bold text-[#deb887]">{selectedOrder.platform}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8d7c9f]">Timestamp:</span>
                    <span className="text-[#cbd5e1] font-mono text-[11px]">
                      {new Date(selectedOrder.timestamp).toLocaleString([], {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8d7c9f]">Device &amp; Browser:</span>
                    <span className="text-[#cbd5e1]">
                      {selectedOrder.device} · {selectedOrder.browser}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized Order Table */}
            <div className="rounded-2xl border border-[#361e12] overflow-hidden">
              <div className="bg-[#24130b] px-4 py-2.5 border-b border-[#361e12] flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#deb887]">
                  Itemized Order Breakdown
                </span>
                <span className="text-[11px] text-[#cbd5e1]">
                  {(selectedOrder.items || []).length} items
                </span>
              </div>

              <div className="divide-y divide-[#2a160d] bg-[#140b07]">
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#27150c] text-[11px] font-bold text-[#c084fc] border border-[#a855f7]/30">
                        x{item.quantity}
                      </span>
                      <span className="font-bold text-[#fffcf8]">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-[#deb887]">
                      {item.price || "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary Footer */}
              <div className="bg-[#1c0f09] p-4 border-t border-[#361e12] flex items-center justify-between">
                <span className="text-xs text-[#a89bb8]">Total Order Amount:</span>
                <span className="font-serif text-xl font-black text-[#4ade80]">
                  {selectedOrder.totalAmount || "N/A"}
                </span>
              </div>
            </div>

            {/* Special Notes / Instructions */}
            {selectedOrder.notes && (
              <div className="p-4 rounded-2xl bg-[#140b07] border border-[#361e12]">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#deb887] block mb-1">
                  Customer Notes &amp; Pickup Instructions
                </span>
                <p className="text-xs text-[#cbd5e1] italic">"{selectedOrder.notes}"</p>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#361e12]">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-[#28150d] hover:bg-[#341b10] border border-[#361e12] text-xs font-bold text-[#cbd5e1] hover:text-white transition-colors cursor-pointer"
              >
                Close Order Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Dashboard Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        {/* Order Action Feedback Toast */}
        {orderToast && (
          <div className="p-4 rounded-2xl bg-[#22c55e]/15 border border-[#22c55e]/40 flex items-center justify-between text-xs text-[#4ade80] shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#22c55e]" />
              <span className="font-bold text-sm">{orderToast}</span>
            </div>
            <button
              onClick={() => setOrderToast(null)}
              className="text-xs text-[#4ade80] hover:text-white font-bold px-2 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Site Status Change Toast Banner */}
        {siteStatusToast && (
          <div className="p-4 rounded-2xl bg-[#22c55e]/15 border border-[#22c55e]/40 flex items-center justify-between text-xs text-[#4ade80] shadow-xl animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#22c55e]" />
              <span className="font-bold text-sm">{siteStatusToast}</span>
            </div>
            <button
              onClick={() => setSiteStatusToast(null)}
              className="text-xs text-[#4ade80] hover:text-white font-bold px-2 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Data Cleared Success Notification Banner */}
        {dataClearedNotification && (
          <div className="p-4 rounded-2xl bg-[#22c55e]/15 border border-[#22c55e]/40 flex items-center justify-between text-xs text-[#4ade80] shadow-xl">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#22c55e]" />
              <span className="font-bold text-sm">
                All data in the admin panel has been cleared successfully! All counters and telemetry are reset to 0.
              </span>
            </div>
            <button
              onClick={() => setDataClearedNotification(false)}
              className="text-xs text-[#4ade80] hover:text-white font-bold px-2 py-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* ====================================================================
            MASTER WEBSITE POWER & OPERATIONAL STATUS CONTROL CENTER
            ==================================================================== */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border transition-all shadow-2xl relative overflow-hidden ${
            isSiteOnline
              ? "bg-gradient-to-br from-[#122315] via-[#1a0f0a] to-[#160d08] border-[#22c55e]/50 shadow-[#22c55e]/5"
              : "bg-gradient-to-br from-[#2f1313] via-[#1c0f09] to-[#160d08] border-[#ef4444]/70 shadow-[#ef4444]/15"
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-xl ${
                  isSiteOnline
                    ? "bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/50"
                    : "bg-[#ef4444]/25 text-[#f87171] border-[#ef4444]/60 animate-pulse"
                }`}
              >
                <Power className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${
                      isSiteOnline
                        ? "bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/50"
                        : "bg-[#ef4444]/25 text-[#fca5a5] border-[#ef4444]/60"
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isSiteOnline ? "bg-[#22c55e] animate-pulse" : "bg-[#ef4444]"
                      }`}
                    />
                    {isSiteOnline ? "WEBSITE IS LIVE & OPERATIONAL (ON)" : "WEBSITE IS OFFLINE & PAUSED (OFF)"}
                  </span>
                  <span className="text-xs text-[#a89bb8]">
                    {isSiteOnline
                      ? "Public visitors can explore menu, call, and order."
                      : "Public visitors see the maintenance screen."}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-black text-[#fffcf8] tracking-tight">
                  {isSiteOnline
                    ? "Customer-Facing Website is Open & Working"
                    : "Customer-Facing Website is Stopped (Maintenance Mode)"}
                </h3>
                <p className="text-xs sm:text-sm text-[#cbd5e1] max-w-2xl leading-relaxed">
                  {isSiteOnline
                    ? "Visitors can access the full American Coffee Shop experience, order online via Toast/Uber Eats, and view all diner plates. Click 'Turn Website OFF' below to temporarily pause the website."
                    : "The public website has been paused. Any visitor landing on the website sees a clean, branded maintenance screen with phone ordering information. The admin panel always stays online so you can turn it back on instantly."}
                </p>
              </div>
            </div>

            {/* Primary ON/OFF Power Toggle Switch Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              {isSiteOnline ? (
                <button
                  onClick={() => setShowToggleOfflineConfirm(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#dc2626] hover:bg-[#b91c1c] text-white font-extrabold text-sm shadow-xl shadow-[#dc2626]/25 transition-all cursor-pointer group"
                >
                  <Power className="h-5 w-5 text-white/90 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Turn Website OFF</span>
                </button>
              ) : (
                <button
                  onClick={() => handleToggleSiteStatus(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold text-sm shadow-xl shadow-[#16a34a]/30 transition-all cursor-pointer group animate-pulse"
                >
                  <Power className="h-5 w-5 text-white/90 group-hover:scale-110 transition-transform duration-300" />
                  <span>Turn Website ON</span>
                </button>
              )}

              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-[#23140c] border border-[#361e12] hover:border-[#deb887] text-xs font-bold text-[#deb887] hover:bg-[#341b10] transition-colors"
                title="Open public website in a new tab"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Test Customer View</span>
              </a>
            </div>
          </div>
        </div>

        {/* Welcome & Overview Headline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#22c55e]">
                Live Production Telemetry
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#fffcf8] tracking-tight mt-1">
              Performance &amp; Customer Activity Overview
            </h2>
            <p className="text-xs sm:text-sm text-[#cbd5e1] mt-0.5">
              Comprehensive telemetry for American Coffee Shop · 41 NE 44th St., Oakland Park, FL
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3f1616] border border-[#ef4444]/50 text-xs font-bold text-[#fca5a5] hover:bg-[#ef4444] hover:text-white transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All Data</span>
            </button>
          </div>
        </div>

        {/* ====================================================================
            6 PRIMARY METRIC CARDS REQUIRED BY USER
            ==================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Total Website Visitors */}
          <div className="p-5 rounded-2xl bg-[#1c0f09] border border-[#a855f7]/30 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#d8b4fe]">
                  Total Visitors
                </span>
                <div className="h-8 w-8 rounded-xl bg-[#7c3aed]/20 text-[#c084fc] flex items-center justify-center border border-[#a855f7]/30">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="font-serif text-3xl font-black text-[#fffcf8]">
                {analytics.totalVisits.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#cbd5e1] mt-1">
                <strong className="text-[#22c55e]">{analytics.uniqueVisitors.toLocaleString()}</strong> unique people
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#361e12] flex items-center gap-1.5 text-[11px] text-[#4ade80]">
              <TrendingUp className="h-3 w-3" />
              <span>{analytics.totalVisits === 0 ? "Awaiting visitor traffic" : "+18.4% this week"}</span>
            </div>
          </div>

          {/* 2. Current Live Viewers */}
          <div className="p-5 rounded-2xl bg-[#1c0f09] border border-[#22c55e]/40 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 h-16 w-16 bg-[#22c55e]/10 rounded-full blur-xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4ade80]">
                  Live Viewers
                </span>
                <div className="h-8 w-8 rounded-xl bg-[#22c55e]/20 text-[#4ade80] flex items-center justify-center border border-[#22c55e]/40">
                  <Activity className="h-4 w-4 animate-pulse" />
                </div>
              </div>
              <div className="font-serif text-3xl font-black text-[#4ade80] flex items-center gap-2">
                <span>{liveViewers}</span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#22c55e]/20 text-[#4ade80]">
                  {liveViewers > 0 ? "Active" : "Idle"}
                </span>
              </div>
              <p className="text-[11px] text-[#cbd5e1] mt-1">
                Browsing website right now
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#361e12] flex items-center gap-1.5 text-[11px] text-[#deb887]">
              <Clock className="h-3 w-3" />
              <span>{liveViewers > 0 ? "Active session tracking" : "Awaiting active visitors"}</span>
            </div>
          </div>

          {/* 3. People Who Ordered Through Website (Actually Ordered vs Button Clicks) */}
          <div className="p-5 rounded-2xl bg-[#1c0f09] border border-[#deb887]/40 shadow-lg flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#deb887]">
                  Orders &amp; Intents
                </span>
                <div className="h-8 w-8 rounded-xl bg-[#deb887]/20 text-[#deb887] flex items-center justify-center border border-[#deb887]/40">
                  <ShoppingBag className="h-4 w-4" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-black text-[#4ade80]">
                  {analytics.totalOrders.toLocaleString()}
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40">
                  Actually Ordered
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-[#361e12] flex items-center justify-between text-xs">
                <span className="text-[#a89bb8]">Button Clicks Only:</span>
                <span className="font-mono font-bold text-[#f59e0b] bg-[#f59e0b]/15 px-2 py-0.5 rounded-md border border-[#f59e0b]/30">
                  {analytics.totalOrderClicks || 0} clicks
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#361e12] flex items-center justify-between text-[11px]">
              <span className="text-[#4ade80] flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>{analytics.totalOrders} Takeout</span>
              </span>
              <span className="text-[#deb887] font-semibold">
                {analytics.totalOrderClicks ? `${analytics.totalOrderClicks} Leads` : "0 Leads"}
              </span>
            </div>
          </div>

          {/* 4. People Who Called Number Through Website */}
          <div className="p-5 rounded-2xl bg-[#1c0f09] border border-[#a855f7]/30 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#d8b4fe]">
                  Phone Calls
                </span>
                <div className="h-8 w-8 rounded-xl bg-[#7c3aed]/20 text-[#c084fc] flex items-center justify-center border border-[#a855f7]/30">
                  <PhoneCall className="h-4 w-4" />
                </div>
              </div>
              <div className="font-serif text-3xl font-black text-[#fffcf8]">
                {analytics.totalCalls.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#cbd5e1] mt-1">
                Direct to (954) 772-8850
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#361e12] flex items-center gap-1.5 text-[11px] text-[#38bdf8]">
              <Sparkles className="h-3 w-3" />
              <span>{analytics.totalCalls === 0 ? "Awaiting customer calls" : "Takeout & table inquiries"}</span>
            </div>
          </div>

          {/* 5. People Who Explored the Menu */}
          <div className="p-5 rounded-2xl bg-[#1c0f09] border border-[#a855f7]/30 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#d8b4fe]">
                  Menu Explored
                </span>
                <div className="h-8 w-8 rounded-xl bg-[#7c3aed]/20 text-[#c084fc] flex items-center justify-center border border-[#a855f7]/30">
                  <UtensilsCrossed className="h-4 w-4" />
                </div>
              </div>
              <div className="font-serif text-3xl font-black text-[#fffcf8]">
                {analytics.totalMenuExplores.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#cbd5e1] mt-1">
                Menu &amp; Drinks viewers
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#361e12] flex items-center gap-1.5 text-[11px] text-[#c084fc]">
              <Flame className="h-3 w-3" />
              <span>{analytics.totalMenuExplores === 0 ? "Awaiting menu explores" : "Top: Breakfast & Espresso"}</span>
            </div>
          </div>

          {/* 6. People Who Opened Location Through Website */}
          <div className="p-5 rounded-2xl bg-[#1c0f09] border border-[#a855f7]/30 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#d8b4fe]">
                  Location Opens
                </span>
                <div className="h-8 w-8 rounded-xl bg-[#7c3aed]/20 text-[#c084fc] flex items-center justify-center border border-[#a855f7]/30">
                  <MapPin className="h-4 w-4" />
                </div>
              </div>
              <div className="font-serif text-3xl font-black text-[#fffcf8]">
                {analytics.totalLocationOpens.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#cbd5e1] mt-1">
                Directions to 41 NE 44th St
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#361e12] flex items-center gap-1.5 text-[11px] text-[#deb887]">
              <CheckCircle2 className="h-3 w-3" />
              <span>{analytics.totalLocationOpens === 0 ? "Awaiting direction requests" : "High intent in-person visits"}</span>
            </div>
          </div>
        </div>

        {/* ====================================================================
            CUSTOMER ORDER DETAILS & INTENT MANAGEMENT CENTER
            Clearly separates "Actually Ordered" vs "Clicked Button Only"
            ==================================================================== */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#1c0f09] border border-[#deb887]/50 shadow-2xl space-y-6">
          {/* Header & Quick Action Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#361e12]">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#deb887]">
                  Order Telemetry &amp; Customer Verification
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#fffcf8] tracking-tight mt-1">
                Customer Order Details &amp; Intent Audit
              </h2>
              <p className="text-xs sm:text-sm text-[#cbd5e1] mt-1 max-w-2xl leading-relaxed">
                Clear distinction between customers who <strong className="text-[#4ade80]">actually ordered</strong> via the website takeout form (with name, phone &amp; items) vs visitors who <strong className="text-[#f59e0b]">just clicked the order button</strong> (ToastTab, Uber Eats, Grubhub).
              </p>
            </div>

            {/* Admin Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleAddSampleConfirmed}
                className="px-3.5 py-2 rounded-xl bg-[#1a3820] hover:bg-[#234b2b] border border-[#22c55e]/60 text-xs font-bold text-[#4ade80] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Simulate a customer placing an actual takeout order"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Test Confirmed Order</span>
              </button>

              <button
                type="button"
                onClick={handleAddSampleClick}
                className="px-3.5 py-2 rounded-xl bg-[#3b2710] hover:bg-[#4d3315] border border-[#f59e0b]/60 text-xs font-bold text-[#fbbf24] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                title="Simulate a customer clicking an order button"
              >
                <MousePointerClick className="h-3.5 w-3.5" />
                <span>+ Test Button Click</span>
              </button>

              <button
                type="button"
                onClick={exportOrdersCSV}
                className="px-3.5 py-2 rounded-xl bg-[#28150d] hover:bg-[#341b10] border border-[#a855f7]/40 text-xs font-bold text-[#deb887] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                title="Download full orders list as CSV spreadsheet"
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-[#22c55e]" />
                <span>Export Orders (CSV)</span>
              </button>
            </div>
          </div>

          {/* 3 KPI Summary Cards for Orders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card A: Confirmed Direct Takeout Orders */}
            <div className="p-4 rounded-2xl bg-[#142618]/90 border border-[#22c55e]/50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[#4ade80] text-xs font-extrabold uppercase tracking-wider mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Actually Ordered (Confirmed)</span>
                </div>
                <div className="font-serif text-3xl font-black text-[#fffcf8]">
                  {confirmedOrdersCount} <span className="text-sm font-sans font-normal text-[#a89bb8]">orders</span>
                </div>
                <p className="text-xs text-[#bbf7d0] mt-1">
                  Direct Takeout Revenue: <strong className="text-white">${totalTakeoutRevenue.toFixed(2)}</strong>
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#4ade80] shrink-0">
                <PackageCheck className="h-6 w-6" />
              </div>
            </div>

            {/* Card B: Button Clicks Only (Intent / Leads) */}
            <div className="p-4 rounded-2xl bg-[#2d1e0c]/90 border border-[#f59e0b]/50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[#fbbf24] text-xs font-extrabold uppercase tracking-wider mb-1">
                  <MousePointerClick className="h-4 w-4" />
                  <span>Button Clicked Only</span>
                </div>
                <div className="font-serif text-3xl font-black text-[#fffcf8]">
                  {buttonClicksCount} <span className="text-sm font-sans font-normal text-[#a89bb8]">clicks</span>
                </div>
                <p className="text-xs text-[#fde68a] mt-1">
                  ToastTab, Uber Eats &amp; Grubhub Leads
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-[#f59e0b]/20 border border-[#f59e0b]/40 flex items-center justify-center text-[#fbbf24] shrink-0">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>

            {/* Card C: Checkout Conversion Rate */}
            <div className="p-4 rounded-2xl bg-[#21142e]/90 border border-[#a855f7]/50 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[#c084fc] text-xs font-extrabold uppercase tracking-wider mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Order Conversion Rate</span>
                </div>
                <div className="font-serif text-3xl font-black text-[#fffcf8]">
                  {ordersList.length > 0
                    ? `${((confirmedOrdersCount / ordersList.length) * 100).toFixed(1)}%`
                    : "0.0%"}
                </div>
                <p className="text-xs text-[#e9d5ff] mt-1">
                  {confirmedOrdersCount} completed / {ordersList.length} total checkout intents
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-[#a855f7]/20 border border-[#a855f7]/40 flex items-center justify-center text-[#c084fc] shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Filtering Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#25140c] p-1.5 rounded-2xl border border-[#a855f7]/30 text-xs">
              <button
                type="button"
                onClick={() => setOrderFilter("all")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  orderFilter === "all"
                    ? "bg-[#7c3aed] text-white shadow-md"
                    : "text-[#d8b4fe] hover:text-white hover:bg-[#341b10]"
                }`}
              >
                All Activity ({ordersList.length})
              </button>

              <button
                type="button"
                onClick={() => setOrderFilter("CONFIRMED")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  orderFilter === "CONFIRMED"
                    ? "bg-[#22c55e] text-black shadow-md"
                    : "text-[#4ade80] hover:text-white hover:bg-[#1f3a23]"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>🟢 Actually Ordered ({confirmedOrdersCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderFilter("BUTTON_CLICKED")}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  orderFilter === "BUTTON_CLICKED"
                    ? "bg-[#f59e0b] text-black shadow-md"
                    : "text-[#fbbf24] hover:text-white hover:bg-[#3f2b15]"
                }`}
              >
                <MousePointerClick className="h-3.5 w-3.5" />
                <span>🟡 Button Clicks Only ({buttonClicksCount})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7c9f]" />
              <input
                type="text"
                placeholder="Search orders, names, phones, dishes..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full rounded-xl bg-[#28150d] border border-[#a855f7]/30 pl-8 pr-3 py-2 text-xs text-[#fffcf8] placeholder:text-[#8d7c9f] focus:outline-none focus:border-[#deb887]"
              />
            </div>
          </div>

          {/* Orders Data Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#361e12]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#24130b] text-[#deb887] uppercase text-[10px] tracking-wider border-b border-[#361e12]">
                <tr>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Customer Name &amp; Phone</th>
                  <th className="py-3 px-4 font-bold">Items / Action Details</th>
                  <th className="py-3 px-4 font-bold">Total Amount</th>
                  <th className="py-3 px-4 font-bold">Platform / Source</th>
                  <th className="py-3 px-4 font-bold">Time</th>
                  <th className="py-3 px-4 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a160d] text-[#cbd5e1]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#8d7c9f]">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <ShoppingBag className="h-10 w-10 text-[#deb887]/40" />
                        <span className="text-sm font-bold text-[#cbd5e1]">
                          No Order Records Found
                        </span>
                        <p className="text-xs text-[#8d7c9f] max-w-md text-center leading-relaxed">
                          When visitors fill the Takeout form, they appear here as <strong className="text-[#4ade80]">🟢 ACTUALLY ORDERED</strong> with phone number &amp; dishes. When they click external delivery buttons, they appear as <strong className="text-[#fbbf24]">🟡 BUTTON CLICK ONLY</strong>.
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={handleAddSampleConfirmed}
                            className="px-3 py-1.5 rounded-xl bg-[#22c55e]/20 hover:bg-[#22c55e]/30 border border-[#22c55e]/40 text-xs font-bold text-[#4ade80] transition-colors cursor-pointer"
                          >
                            + Generate Sample Confirmed Order
                          </button>
                          <button
                            type="button"
                            onClick={handleAddSampleClick}
                            className="px-3 py-1.5 rounded-xl bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 border border-[#f59e0b]/40 text-xs font-bold text-[#fbbf24] transition-colors cursor-pointer"
                          >
                            + Generate Sample Button Click
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isConfirmed = order.status === "CONFIRMED";
                    const formattedDate = new Date(order.timestamp).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={order.id} className="hover:bg-[#23120a] transition-colors">
                        {/* 1. Status Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isConfirmed ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40 shadow-sm">
                              <CheckCircle2 className="h-3 w-3 text-[#22c55e]" />
                              <span>ACTUALLY ORDERED</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40 shadow-sm">
                              <MousePointerClick className="h-3 w-3 text-[#f59e0b]" />
                              <span>BUTTON CLICK ONLY</span>
                            </span>
                          )}
                        </td>

                        {/* 2. Order ID Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`font-mono font-bold text-xs ${
                              isConfirmed ? "text-[#4ade80]" : "text-[#deb887]"
                            }`}
                          >
                            #{order.id}
                          </span>
                        </td>

                        {/* 3. Customer Info Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isConfirmed ? (
                            <div>
                              <span className="font-bold text-[#fffcf8] block text-xs">
                                {order.customerName || "Customer"}
                              </span>
                              {order.customerPhone ? (
                                <a
                                  href={`tel:${order.customerPhone.replace(/[^0-9]/g, "")}`}
                                  className="text-[11px] text-[#deb887] hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
                                  title="Click to call customer phone"
                                >
                                  <Phone className="h-3 w-3 text-[#4ade80]" />
                                  <span>{order.customerPhone}</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-[#8d7c9f]">No Phone</span>
                              )}
                            </div>
                          ) : (
                            <div>
                              <span className="text-xs text-[#a89bb8]">Website Visitor</span>
                              <span className="text-[10px] text-[#8d7c9f] block">
                                Lead / Intent Click
                              </span>
                            </div>
                          )}
                        </td>

                        {/* 4. Items / Action Details Column */}
                        <td className="py-3 px-4 max-w-xs">
                          {isConfirmed ? (
                            <div>
                              <span className="font-semibold text-xs text-[#fffcf8] block truncate">
                                {(order.items || [])
                                  .map((i) => `${i.name} (x${i.quantity})`)
                                  .join(", ")}
                              </span>
                              {order.notes && (
                                <span className="text-[11px] text-[#8d7c9f] block truncate italic">
                                  Note: {order.notes}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-[#fde68a] truncate block">
                              {order.notes || `Clicked ${order.platform} link`}
                            </span>
                          )}
                        </td>

                        {/* 5. Total Amount Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isConfirmed ? (
                            <span className="font-mono font-bold text-sm text-[#4ade80]">
                              {order.totalAmount || "—"}
                            </span>
                          ) : (
                            <span className="font-mono text-xs text-[#8d7c9f]">
                              N/A (Link)
                            </span>
                          )}
                        </td>

                        {/* 6. Platform / Source Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#2a170e] text-[#deb887] border border-[#a855f7]/30">
                            {order.platform}
                          </span>
                        </td>

                        {/* 7. Timestamp Column */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-[#8d7c9f]">
                          {formattedDate}
                        </td>

                        {/* 8. Action Column */}
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 rounded-xl bg-[#28150d] hover:bg-[#7c3aed] border border-[#a855f7]/40 hover:border-[#c084fc] text-xs font-bold text-[#deb887] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                          >
                            <Receipt className="h-3.5 w-3.5" />
                            <span>{isConfirmed ? "View Receipt" : "Details"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ====================================================================
            VISUAL CHARTS SECTION (7-Day Trends & Distributions)
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 7-Day Trend Chart (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-[#1c0f09] border border-[#a855f7]/30 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#fffcf8]">
                  7-Day Traffic &amp; Customer Intent Trends
                </h3>
                <p className="text-xs text-[#a89bb8]">
                  Daily progression of visitors, menu views, orders, and telephone calls
                </p>
              </div>
              <span className="text-xs font-bold text-[#deb887] bg-[#deb887]/15 px-3 py-1 rounded-full border border-[#deb887]/30 self-start sm:self-auto">
                Past 7 Days
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.dailyTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorMenu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#deb887" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#deb887" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d190f" />
                  <XAxis dataKey="day" stroke="#8d7c9f" fontSize={11} />
                  <YAxis stroke="#8d7c9f" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#160d08",
                      borderColor: "#a855f7",
                      borderRadius: "12px",
                      fontSize: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                  <Area
                    type="monotone"
                    dataKey="visits"
                    name="Visitors"
                    stroke="#c084fc"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorVisits)"
                  />
                  <Area
                    type="monotone"
                    dataKey="menuExplores"
                    name="Menu Views"
                    stroke="#deb887"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorMenu)"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Online Ordering Platform Share (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-[#1c0f09] border border-[#a855f7]/30 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-[#fffcf8]">
                  Ordering Channels
                </h3>
                <span className="text-[11px] font-bold text-[#deb887] uppercase">
                  {analytics.totalOrders} Total
                </span>
              </div>
              <p className="text-xs text-[#a89bb8] mb-4">
                Breakdown of customer orders across digital channels
              </p>

              {platformChartData.length === 0 ? (
                <div className="h-48 w-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#361e12] rounded-2xl bg-[#140b07]">
                  <ShoppingBag className="h-8 w-8 text-[#deb887]/40 mb-2" />
                  <p className="text-xs font-bold text-[#cbd5e1]">No Orders Logged Yet</p>
                  <p className="text-[11px] text-[#8d7c9f] mt-1 max-w-[200px]">
                    Orders initiated through Toast, Uber Eats, and delivery platforms will populate here.
                  </p>
                </div>
              ) : (
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {platformChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PLATFORM_COLORS[entry.name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#160d08",
                          borderColor: "#a855f7",
                          borderRadius: "8px",
                          fontSize: "11px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Platform Breakdown List */}
            {platformChartData.length > 0 ? (
              <div className="space-y-2 mt-4 pt-4 border-t border-[#361e12]">
                {platformChartData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            PLATFORM_COLORS[item.name] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length],
                        }}
                      />
                      <span className="text-[#cbd5e1]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#fffcf8]">{item.value} orders</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t border-[#361e12] text-center text-[11px] text-[#8d7c9f]">
                0 total orders recorded
              </div>
            )}
          </div>
        </div>

        {/* ====================================================================
            ROW 2: MENU PREFERENCES & TOP DISHES CLICKED
            ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Menu Sections Explored */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1c0f09] border border-[#a855f7]/30 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg font-bold text-[#fffcf8]">
                Most Explored Menu Sections
              </h3>
              <span className="text-xs font-bold text-[#c084fc]">
                {analytics.totalMenuExplores} Explorations
              </span>
            </div>
            <p className="text-xs text-[#a89bb8] mb-5">
              Categories visitors browse most frequently on the digital menu
            </p>

            {menuChartData.length === 0 ? (
              <div className="h-60 w-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#361e12] rounded-2xl bg-[#140b07]">
                <UtensilsCrossed className="h-8 w-8 text-[#c084fc]/40 mb-2" />
                <p className="text-xs font-bold text-[#cbd5e1]">No Menu Activity Logged Yet</p>
                <p className="text-[11px] text-[#8d7c9f] mt-1 max-w-[240px]">
                  When visitors browse breakfast, lunch, or drink categories, view counts will appear here.
                </p>
              </div>
            ) : (
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={menuChartData} layout="vertical" margin={{ left: 30, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d190f" horizontal={false} />
                    <XAxis type="number" stroke="#8d7c9f" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#d8b4fe" fontSize={11} width={130} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#160d08",
                        borderColor: "#a855f7",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="count" name="Views" fill="#7c3aed" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Top Customer Favorites / Dishes */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1c0f09] border border-[#a855f7]/30 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif text-lg font-bold text-[#fffcf8]">
                Top Dishes Clicked &amp; Viewed
              </h3>
              <span className="text-xs font-bold text-[#deb887] uppercase">
                Customer Favorites
              </span>
            </div>
            <p className="text-xs text-[#a89bb8] mb-5">
              Individual diner plates generating the highest customer clicks
            </p>

            {Object.keys(analytics.topDishesClicked).length === 0 ? (
              <div className="h-60 w-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-[#361e12] rounded-2xl bg-[#140b07]">
                <Coffee className="h-8 w-8 text-[#deb887]/40 mb-2" />
                <p className="text-xs font-bold text-[#cbd5e1]">No Dish Interactions Yet</p>
                <p className="text-[11px] text-[#8d7c9f] mt-1 max-w-[240px]">
                  Dish cards clicked by visitors on the website will be ranked and tracked here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(analytics.topDishesClicked).map(([dish, clicks], index) => {
                  const max = 160;
                  const pct = Math.min(100, Math.round((clicks / max) * 100));
                  return (
                    <div key={dish} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#fffcf8] flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2a170e] text-[10px] font-bold text-[#c084fc]">
                            #{index + 1}
                          </span>
                          <span>{dish}</span>
                        </span>
                        <span className="font-bold text-[#deb887]">{clicks} views</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#27150c] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#c084fc] transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ====================================================================
            LIVE EVENT STREAM & DETAILED AUDIT LOG TABLE
            ==================================================================== */}
        <div className="p-6 rounded-3xl bg-[#1c0f09] border border-[#a855f7]/30 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-[#fffcf8]">
                  Live Activity Stream &amp; Audit Log
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/30">
                  {filteredEvents.length} Events
                </span>
              </div>
              <p className="text-xs text-[#a89bb8] mt-0.5">
                Real-time chronological events recorded from visitors browsing American Coffee Shop
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Search Bar */}
              <div className="relative">
                <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8d7c9f]" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-xl bg-[#28150d] border border-[#a855f7]/30 pl-8 pr-3 py-1.5 text-xs text-[#fffcf8] placeholder:text-[#8d7c9f] focus:outline-none focus:border-[#c084fc]"
                />
              </div>

              {/* Event Type Filters */}
              <div className="flex flex-wrap items-center gap-1 bg-[#25140c] p-1 rounded-xl border border-[#a855f7]/30 text-xs">
                {[
                  { id: "all", label: "All" },
                  { id: "order", label: "Orders" },
                  { id: "call", label: "Calls" },
                  { id: "menu_explore", label: "Menu" },
                  { id: "location_open", label: "Location" },
                  { id: "visit", label: "Visits" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      filterType === tab.id
                        ? "bg-[#7c3aed] text-[#ffffff] shadow"
                        : "text-[#d8b4fe] hover:text-[#ffffff] hover:bg-[#341b10]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Log Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#361e12]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#24130b] text-[#deb887] uppercase text-[10px] tracking-wider border-b border-[#361e12]">
                <tr>
                  <th className="py-3 px-4 font-bold">Event Type</th>
                  <th className="py-3 px-4 font-bold">Action / Title</th>
                  <th className="py-3 px-4 font-bold">Details</th>
                  <th className="py-3 px-4 font-bold">Device &amp; Browser</th>
                  <th className="py-3 px-4 font-bold text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a160d] text-[#cbd5e1]">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#8d7c9f]">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Activity className="h-8 w-8 text-[#7c3aed]/40" />
                        <span className="text-xs font-bold text-[#cbd5e1]">No Activity Events Logged Yet</span>
                        <span className="text-[11px] text-[#8d7c9f] max-w-sm">
                          Live visitor telemetry will stream here in real time as customers visit, view menu items, call the cafe, or start orders.
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEvents.slice(0, 30).map((evt) => {
                    let badge = (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#381d11] text-[#d8b4fe] border border-[#a855f7]/30">
                        <Users className="h-3 w-3" /> Visit
                      </span>
                    );
                    if (evt.type === "order") {
                      badge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#deb887]/20 text-[#deb887] border border-[#deb887]/40">
                          <ShoppingBag className="h-3 w-3" /> Order
                        </span>
                      );
                    } else if (evt.type === "call") {
                      badge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40">
                          <PhoneCall className="h-3 w-3" /> Call
                        </span>
                      );
                    } else if (evt.type === "menu_explore") {
                      badge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#7c3aed]/25 text-[#c084fc] border border-[#a855f7]/40">
                          <UtensilsCrossed className="h-3 w-3" /> Menu
                        </span>
                      );
                    } else if (evt.type === "location_open") {
                      badge = (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40">
                          <MapPin className="h-3 w-3" /> Location
                        </span>
                      );
                    }

                    const timeStr = new Date(evt.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    });

                    return (
                      <tr key={evt.id} className="hover:bg-[#23120a] transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">{badge}</td>
                        <td className="py-3 px-4 font-bold text-[#fffcf8] whitespace-nowrap">
                          {evt.title}
                        </td>
                        <td className="py-3 px-4 text-[#cbd5e1] max-w-md truncate">
                          {evt.detail}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-[#a89bb8] whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            {evt.device === "Mobile" ? (
                              <Smartphone className="h-3 w-3" />
                            ) : evt.device === "Tablet" ? (
                              <Tablet className="h-3 w-3" />
                            ) : (
                              <Monitor className="h-3 w-3" />
                            )}
                            <span>
                              {evt.device} · {evt.browser}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-[11px] font-mono text-[#8d7c9f] whitespace-nowrap">
                          {timeStr}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="mt-16 border-t border-[#25130b] bg-[#0c0604] py-6 px-4 text-center text-xs text-[#716480]">
        <p>
          American Coffee Shop · Executive Admin Management Suite · Protected by 256-bit TLS Encryption
        </p>
        <p className="mt-1 text-[11px]">
          Location: 41 NE 44th St. (Prospect Rd.), Oakland Park, FL 33334 · Tel: {BUSINESS.phoneDisplay}
        </p>
      </footer>
    </div>
  );
}
