import { useState, useMemo, useEffect } from "react";
import {
  Menu as MenuIcon,
  X,
  MapPin,
  Star,
  Coffee,
  ArrowRight,
  Phone,
  Clock,
  Sparkles,
  Search,
  Flame,
  UtensilsCrossed,
  ShoppingBag,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Lock,
  Plus,
  Minus,
  Check,
  User,
} from "lucide-react";
import { BUSINESS, ORDER_PLATFORMS } from "@/lib/business";
import { MENU_SECTIONS, MENU_CATEGORIES, type MenuSection } from "@/data/menuData";
import { RESTAURANT_POLICIES } from "@/data/policies";
import {
  trackVisit,
  trackOrder,
  trackOrderClick,
  trackOrderConfirmed,
  trackCall,
  trackMenuExplore,
  trackLocationOpen,
} from "@/lib/analytics";
import { getSiteOnlineStatus, subscribeSiteStatus } from "@/lib/siteStatus";
import { SiteOfflineScreen } from "./SiteOfflineScreen";

// Visual food photography assets
import spanishCafeHero from "@/assets/spanish-cafe-table-hero.jpg";
import coffeeImg from "@/assets/coffee.jpg";
import cubanImg from "@/assets/cuban-sandwich.jpg";
import chickenWafflesImg from "@/assets/chicken-waffles.jpg";
import chickenClubImg from "@/assets/chicken-club.jpg";
import steakSandwichImg from "@/assets/steak-sandwich.jpg";
import lechonAsadoImg from "@/assets/lechon-asado.jpg";
import huevosRancherosImg from "@/assets/huevos-rancheros.jpg";
import fishChipsImg from "@/assets/fish-chips.jpg";
import chocolatePancakesImg from "@/assets/chocolate-pancakes.jpg";
import omeletteImg from "@/assets/omelette.jpg";
import heroSpotImg from "@/assets/hero-spot.jpg";
import spanishSpreadImg from "@/assets/spanish-spread.jpg";
import atmosphereImg from "@/assets/atmosphere.jpg";
import sarah from "@/assets/sarah.jpg";
import james from "@/assets/james.jpg";
import emily from "@/assets/emily.jpg";

// The 12 Featured Customer Favorites (Concise, punchy 1-liners)
const FEATURED_FAVORITES = [
  {
    id: "feat-cafe-con-leche",
    name: "Cafe Con Leche",
    spanishName: "Café con Leche Tradicional",
    description: "Rich espresso blended with warm steamed milk.",
    price: "Small $2.75 | Large $3.75",
    badge: "HOUSE FAVORITE",
    image: coffeeImg,
    category: "beverages",
    targetTab: "drinks" as const,
  },
  {
    id: "feat-cuban-sandwich",
    name: "Cuban Sandwich",
    spanishName: "Sándwich Cubano",
    description: "Roast pork, ham, Swiss cheese, pickles & mustard on Cuban bread.",
    price: "$10.99",
    badge: "FEATURED",
    image: cubanImg,
    category: "sandwiches",
    targetTab: "lunch" as const,
  },
  {
    id: "feat-chicken-waffles",
    name: "Chicken & Waffles",
    description: "Golden Belgian waffle topped with crispy fried chicken breast.",
    price: "$12.99",
    badge: "FEATURED",
    image: chickenWafflesImg,
    category: "breakfast",
    targetTab: "breakfast" as const,
  },
  {
    id: "feat-chicken-club",
    name: "Chicken Club Sandwich",
    description: "Triple-decker stacked with grilled chicken, bacon & lettuce.",
    price: "$11.99",
    badge: "FEATURED",
    image: chickenClubImg,
    category: "clubs",
    targetTab: "lunch" as const,
  },
  {
    id: "feat-steak-sandwich",
    name: "Palomilla Steak Sandwich",
    spanishName: "Pan con Bistec Palomilla",
    description: "Cuban minute steak, grilled onions & potato sticks on Cuban bread.",
    price: "$11.99",
    badge: "HOUSE FAVORITE",
    image: steakSandwichImg,
    category: "sandwiches",
    targetTab: "lunch" as const,
  },
  {
    id: "feat-chicken-caesar",
    name: "Chicken Caesar Salad",
    description: "Crisp romaine, parmesan, croutons & grilled chicken.",
    price: "$11.99",
    badge: "POPULAR PICK",
    image: spanishSpreadImg,
    category: "salads",
    targetTab: "lunch" as const,
  },
  {
    id: "feat-fish-chips",
    name: "Fish & Chips",
    description: "Beer-battered fish fillets with tartar sauce and fries.",
    price: "$11.49",
    badge: "FEATURED",
    image: fishChipsImg,
    category: "seafood",
    targetTab: "lunch" as const,
  },
  {
    id: "feat-shrimp-chips",
    name: "Shrimp & Chips",
    description: "Crispy fried butterfly shrimp served with fries or rice & beans.",
    price: "$12.49",
    badge: "POPULAR PICK",
    image: fishChipsImg,
    category: "seafood",
    targetTab: "lunch" as const,
  },
  {
    id: "feat-huevos-rancheros",
    name: "Huevos Rancheros",
    spanishName: "Huevos al Estilo Ranchero",
    description: "Two eggs served over tortillas with Spanish creole sauce.",
    price: "$10.99",
    badge: "FEATURED",
    image: huevosRancherosImg,
    category: "spanish",
    targetTab: "breakfast" as const,
  },
  {
    id: "feat-breakfast-sandwiches",
    name: "House Special Sandwich",
    description: "Eggs, bacon, ham, sausage & melted cheese on warm Cuban bread.",
    price: "$7.99",
    badge: "POPULAR PICK",
    image: heroSpotImg,
    category: "sandwiches",
    targetTab: "breakfast" as const,
  },
  {
    id: "feat-spanish-omelet",
    name: "Spanish Omelet",
    spanishName: "Tortilla a la Española",
    description: "Three-egg omelet topped with savory Spanish sofrito sauce.",
    price: "$10.99",
    badge: "HOUSE FAVORITE",
    image: omeletteImg,
    category: "omelets",
    targetTab: "breakfast" as const,
  },
  {
    id: "feat-choc-pancakes",
    name: "Chocolate Chip Pancakes",
    description: "Fluffy golden pancakes loaded with melted chocolate chips.",
    price: "$8.99",
    badge: "POPULAR PICK",
    image: chocolatePancakesImg,
    category: "breakfast",
    targetTab: "breakfast" as const,
  },
];

// Helper to render badge
function DishBadge({ type }: { type?: "FEATURED" | "HOUSE FAVORITE" | "POPULAR PICK" }) {
  if (!type) return null;
  if (type === "FEATURED") {
    return (
      <span className="badge-featured">
        <Flame className="h-3 w-3" />
        <span>Featured</span>
      </span>
    );
  }
  if (type === "POPULAR PICK") {
    return (
      <span className="badge-popular">
        <Sparkles className="h-3 w-3" />
        <span>Popular</span>
      </span>
    );
  }
  return (
    <span className="badge-favorite">
      <Star className="h-3 w-3 fill-[#deb887]" />
      <span>Favorite</span>
    </span>
  );
}

// Navigation links
const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Favorites", href: "#featured" },
  { label: "Menu", href: "#menu" },
  { label: "Drinks & Bar", href: "#drinks" },
  { label: "About", href: "#about" },
  { label: "Location", href: "#location" },
];

const DIRECT_TAKEOUT_MENU = [
  { id: "cafe-leche", name: "Cafe Con Leche (Large)", price: 3.75, category: "Cuban Espresso" },
  { id: "cuban-sandwich", name: "Classic Cuban Sandwich", price: 10.99, category: "Pressed Sandwiches" },
  { id: "chicken-waffles", name: "Chicken & Belgian Waffles", price: 12.99, category: "Breakfast Griddles" },
  { id: "palomilla-steak", name: "Palomilla Steak Sandwich", price: 11.99, category: "Cuban Specialties" },
  { id: "spanish-omelet", name: "Spanish Omelet (Tortilla)", price: 9.99, category: "Diner Classics" },
  { id: "choc-pancakes", name: "Chocolate Chip Pancakes", price: 8.99, category: "Breakfast Griddles" },
  { id: "cuban-toast", name: "Fresh Buttered Cuban Toast", price: 2.75, category: "Bakery & Sides" },
  { id: "huevos-rancheros", name: "Huevos Rancheros Specials", price: 10.49, category: "Breakfast Griddles" },
];

// Interactive Order Online Modal with Both Direct Counter Takeout (Actually Ordered) and Partner Links (Button Clicked)
function OrderOnlineModal({
  open,
  onClose,
  onSelectCategory,
}: {
  open: boolean;
  onClose: () => void;
  onSelectCategory: (cat: string) => void;
}) {
  const [orderMode, setOrderMode] = useState<"direct" | "apps">("direct");
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "cafe-leche": 1,
    "cuban-sandwich": 1,
  });
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [orderError, setOrderError] = useState("");
  const [confirmedReceipt, setConfirmedReceipt] = useState<any>(null);

  if (!open) return null;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedItems = DIRECT_TAKEOUT_MENU.filter((item) => (quantities[item.id] || 0) > 0).map(
    (item) => ({
      name: item.name,
      quantity: quantities[item.id] || 0,
      price: `$${(item.price * (quantities[item.id] || 0)).toFixed(2)}`,
    })
  );

  const subtotal = DIRECT_TAKEOUT_MENU.reduce((sum, item) => {
    return sum + item.price * (quantities[item.id] || 0);
  }, 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const handlePlaceDirectOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");

    if (selectedItems.length === 0) {
      setOrderError("Please select at least one dish or drink from the menu.");
      return;
    }

    if (!customerName.trim()) {
      setOrderError("Please enter your name for takeout counter pickup.");
      return;
    }

    if (!customerPhone.trim()) {
      setOrderError("Please enter your phone number so we can text you when ready.");
      return;
    }

    const orderRecord = trackOrderConfirmed({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items: selectedItems,
      totalAmount: `$${total.toFixed(2)}`,
      notes: customerNotes.trim() || "Counter Pickup Takeout Order",
      platform: "Direct Online Takeout",
    });

    setConfirmedReceipt(orderRecord);
  };

  const handleResetForNewOrder = () => {
    setConfirmedReceipt(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerNotes("");
    setQuantities({ "cafe-leche": 1, "cuban-sandwich": 1 });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[92vh] overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#24140e] to-[#140a06] border border-[#c084fc]/50 p-4 sm:p-7 text-[#fffcf8] shadow-2xl cursor-default"
        role="dialog"
        aria-modal="true"
      >
        {/* Glow background effects */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#a855f7]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-[#e11d48]/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-[#180d08] border border-[#a855f7]/40 flex items-center justify-center text-[#d8b4fe] hover:text-[#fffcf8] hover:border-[#c084fc] transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#e11d48] to-[#9333ea] text-[#ffffff] shadow-lg shrink-0">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-black text-[#fffcf8]">Order Online</h3>
            <p className="text-xs font-bold uppercase tracking-wider text-[#deb887]">
              American Coffee Shop · Oakland Park, FL
            </p>
          </div>
        </div>

        {/* TAB TOGGLE: DIRECT TAKEOUT ORDER vs DELIVERY PARTNER APPS */}
        {!confirmedReceipt && (
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#1a0f0a] border border-[#a855f7]/30 my-4 text-xs font-bold">
            <button
              onClick={() => setOrderMode("direct")}
              className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                orderMode === "direct"
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white shadow-md"
                  : "text-[#d8b4fe] hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#deb887]" />
              <span>Direct Counter Takeout (Order Here)</span>
            </button>
            <button
              onClick={() => setOrderMode("apps")}
              className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                orderMode === "apps"
                  ? "bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white shadow-md"
                  : "text-[#d8b4fe] hover:text-white"
              }`}
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#38bdf8]" />
              <span>Delivery Apps (Toast / Uber Eats)</span>
            </button>
          </div>
        )}

        {/* -------------------------------------------------------------
            CASE 1: ORDER CONFIRMED RECEIPT VIEW
            ------------------------------------------------------------- */}
        {confirmedReceipt ? (
          <div className="py-6 px-4 sm:px-6 rounded-2xl bg-[#1b2b1a] border border-[#22c55e]/50 text-center space-y-4 animate-in fade-in">
            <div className="h-14 w-14 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/60 text-[#4ade80] flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#4ade80] bg-[#22c55e]/20 px-3 py-1 rounded-full border border-[#22c55e]/30 inline-block mb-1">
                ✓ Order Confirmed &amp; In the Kitchen
              </span>
              <h4 className="font-serif text-2xl font-black text-[#fffcf8] mt-2">
                Thank You, {confirmedReceipt.customerName}!
              </h4>
              <p className="text-xs text-[#cbd5e1] mt-1">
                Your takeout order has been received by our kitchen staff.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="text-left bg-[#121c11] p-4 rounded-xl border border-[#22c55e]/30 space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#22c55e]/20 pb-2">
                <span className="text-[#a89bb8]">Order Number:</span>
                <span className="font-mono font-bold text-[#deb887]">#{confirmedReceipt.id}</span>
              </div>
              <div className="flex justify-between border-b border-[#22c55e]/20 pb-2">
                <span className="text-[#a89bb8]">Contact Phone:</span>
                <span className="font-bold text-[#fffcf8]">{confirmedReceipt.customerPhone}</span>
              </div>
              <div className="flex justify-between border-b border-[#22c55e]/20 pb-2">
                <span className="text-[#a89bb8]">Estimated Ready Time:</span>
                <span className="font-bold text-[#4ade80]">15–20 Minutes (Counter Pickup)</span>
              </div>
              <div className="flex justify-between border-b border-[#22c55e]/20 pb-2">
                <span className="text-[#a89bb8]">Pickup Location:</span>
                <span className="font-bold text-[#fffcf8]">41 NE 44th St., Oakland Park, FL</span>
              </div>

              <div className="pt-2">
                <span className="text-[#a89bb8] block mb-1">Ordered Dishes:</span>
                <div className="space-y-1">
                  {confirmedReceipt.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[#fffcf8]">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-[#deb887] font-semibold">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between border-t border-[#22c55e]/30 pt-2 text-sm font-bold text-[#4ade80]">
                <span>Total Amount Due at Counter:</span>
                <span>{confirmedReceipt.totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold text-xs shadow-lg transition-colors cursor-pointer"
              >
                Done / Close Receipt
              </button>
              <button
                onClick={handleResetForNewOrder}
                className="py-2.5 px-4 rounded-xl bg-[#1e2a1c] border border-[#22c55e]/40 hover:bg-[#283b26] text-xs font-bold text-[#4ade80] transition-colors cursor-pointer"
              >
                Place Another Order
              </button>
            </div>
          </div>
        ) : orderMode === "direct" ? (
          /* -------------------------------------------------------------
             CASE 2: DIRECT TAKEOUT ORDER BUILDER FORM
             ------------------------------------------------------------- */
          <form onSubmit={handlePlaceDirectOrder} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#1c0f09] border border-[#deb887]/30">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#361e12]">
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#fffcf8]">
                    1. Select Popular Diner Items
                  </h4>
                  <p className="text-[11px] text-[#a89bb8]">
                    Click + to add dishes or espresso to your order
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#deb887] bg-[#deb887]/15 px-2.5 py-0.5 rounded-full">
                  Pickup Ready in 15m
                </span>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DIRECT_TAKEOUT_MENU.map((item) => {
                  const qty = quantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                        qty > 0
                          ? "bg-[#2b170f] border-[#c084fc]/50 shadow-sm"
                          : "bg-[#180d08] border-[#361e12]"
                      }`}
                    >
                      <div className="pr-2">
                        <span className="text-xs font-bold text-[#fffcf8] block leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#deb887] font-semibold">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {qty > 0 ? (
                          <>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-6 w-6 rounded-lg bg-[#3d1f14] hover:bg-[#522919] border border-[#a855f7]/30 text-[#d8b4fe] flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-5 text-center font-bold text-xs text-[#fffcf8]">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-6 w-6 rounded-lg bg-[#7c3aed] hover:bg-[#9333ea] text-white flex items-center justify-center cursor-pointer transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2.5 py-1 rounded-lg bg-[#2e1810] hover:bg-[#7c3aed] border border-[#deb887]/30 hover:border-[#c084fc] text-xs font-bold text-[#deb887] hover:text-white transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="p-3.5 rounded-2xl bg-[#1c0f09] border border-[#deb887]/30 space-y-3">
              <h4 className="font-serif text-sm font-bold text-[#fffcf8]">
                2. Contact &amp; Pickup Info
              </h4>

              {orderError && (
                <div className="p-2.5 rounded-xl bg-[#ef4444]/20 border border-[#ef4444]/40 text-xs text-[#fca5a5]">
                  {orderError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d8b4fe] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Martinez"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#28150d] border border-[#a855f7]/30 focus:border-[#deb887] text-xs text-[#fffcf8] placeholder:text-[#8d7c9f] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d8b4fe] mb-1">
                    Phone Number (for pickup SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(954) 555-0199"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#28150d] border border-[#a855f7]/30 focus:border-[#deb887] text-xs text-[#fffcf8] placeholder:text-[#8d7c9f] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d8b4fe] mb-1">
                  Special Notes / Cooking Requests (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Extra hot milk, sliced Cuban bread, butter on side"
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#28150d] border border-[#a855f7]/30 focus:border-[#deb887] text-xs text-[#fffcf8] placeholder:text-[#8d7c9f] focus:outline-none"
                />
              </div>

              {/* Order Calculation Bar */}
              <div className="pt-2 border-t border-[#361e12] flex items-center justify-between text-xs">
                <span className="text-[#a89bb8]">
                  {selectedItems.reduce((acc, i) => acc + i.quantity, 0)} items selected
                </span>
                <div className="text-right">
                  <span className="text-[#a89bb8] mr-2">Total (with tax):</span>
                  <span className="font-serif text-base font-black text-[#4ade80]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] text-black font-black text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="h-4 w-4" />
                <span>Confirm &amp; Place Takeout Order (${total.toFixed(2)})</span>
              </button>
            </div>
          </form>
        ) : (
          /* -------------------------------------------------------------
             CASE 3: EXTERNAL DELIVERY PARTNERS & TOAST TAB (INTENTS)
             ------------------------------------------------------------- */
          <div>
            <p className="text-xs sm:text-sm text-[#d8b4fe] mt-1 mb-4 leading-relaxed">
              Prefer delivery directly to your home or office? Select an authorized delivery partner below:
            </p>

            {/* SECTION 1: OFFICIAL DIRECT ORDERING (TOAST TAB & TOAST APP) */}
            <div className="toast-featured-card p-4 sm:p-5 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#deb887] bg-[#deb887]/15 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#deb887]" />
                  ★ RECOMMENDED · OFFICIAL STORE (LOWEST FEES)
                </span>
                <span className="text-[11px] font-semibold text-[#c084fc]">Direct from Restaurant</span>
              </div>

              <h4 className="font-serif text-lg font-black text-[#fffcf8]">
                Toast Online Ordering
              </h4>
              <p className="text-xs text-[#d8b4fe] mt-0.5 mb-3.5">
                Order directly through our official Toast system for zero markup and fastest counter pickup!
              </p>

              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://order.toasttab.com/online/american-coffee-shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOrderClick("Toast Tab (Direct)", "Order on ToastTab official store")}
                  className="order-online-cool-btn text-xs py-2 px-4 shadow-lg"
                >
                  <span>Order on ToastTab</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <a
                  href="https://toast.app/r/american-coffee-shop/order"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOrderClick("Toast Mobile App", "Launched Toast mobile app")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#1b0e08] text-[#e9d5ff] border border-[#a855f7]/40 hover:border-[#c084fc] hover:bg-[#2b170e] transition-colors"
                >
                  <span>Toast Mobile App</span>
                  <ExternalLink className="h-3 w-3 text-[#c084fc]" />
                </a>
              </div>
            </div>

            {/* SECTION 2: DELIVERY & TAKEOUT PLATFORMS GRID (UBER EATS, GRUBHUB, POSTMATES, SEAMLESS) */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#d8b4fe]">
                  Delivery &amp; Pickup Apps
                </h4>
                <span className="text-[11px] text-[#94a3b8]">Delivered to your door</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. UBER EATS */}
                <a
                  href="https://www.ubereats.com/store/american-coffee-shop/1-7JmPiFQ8mLIgmWCy86Wg"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOrderClick("Uber Eats", "Redirected to Uber Eats storefront")}
                  className="online-partner-card p-3.5 flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#22c55e] bg-[#22c55e]/15 px-2 py-0.5 rounded-md">
                        Uber Eats
                      </span>
                      <span className="text-[10px] font-bold text-[#deb887]">4.7 ★ (1k+ reviews)</span>
                    </div>
                    <span className="text-xs text-[#e2d9f3] font-medium mt-1">
                      Full breakfast &amp; lunch delivery
                    </span>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-[#27150c] flex items-center justify-center text-[#c084fc] group-hover:text-[#ffffff] group-hover:bg-[#7c3aed] transition-all shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </a>

                {/* 2. GRUBHUB */}
                <a
                  href="https://www.grubhub.com/restaurant/american-coffee-shop-41-ne-44th-st-oakland-park/2103174"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOrderClick("Grubhub", "Redirected to Grubhub storefront")}
                  className="online-partner-card p-3.5 flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#f97316] bg-[#f97316]/15 px-2 py-0.5 rounded-md">
                        Grubhub
                      </span>
                      <span className="text-[10px] font-bold text-[#d8b4fe]">Delivery &amp; Pickup</span>
                    </div>
                    <span className="text-xs text-[#e2d9f3] font-medium mt-1">
                      Order American Coffee Shop on Grubhub
                    </span>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-[#27150c] flex items-center justify-center text-[#c084fc] group-hover:text-[#ffffff] group-hover:bg-[#7c3aed] transition-all shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </a>

                {/* 3. POSTMATES */}
                <a
                  href="https://postmates.com/store/american-coffee-shop/1-7JmPiFQ8mLIgmWCy86Wg"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOrderClick("Postmates", "Redirected to Postmates storefront")}
                  className="online-partner-card p-3.5 flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#38bdf8] bg-[#38bdf8]/15 px-2 py-0.5 rounded-md">
                        Postmates
                      </span>
                      <span className="text-[10px] font-bold text-[#d8b4fe]">Local Delivery</span>
                    </div>
                    <span className="text-xs text-[#e2d9f3] font-medium mt-1">
                      Fast on-demand delivery via Postmates
                    </span>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-[#27150c] flex items-center justify-center text-[#c084fc] group-hover:text-[#ffffff] group-hover:bg-[#7c3aed] transition-all shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </a>

                {/* 4. SEAMLESS */}
                <a
                  href="https://www.seamless.com/menu/american-coffee-shop-41-ne-44th-st-oakland-park/2103174"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackOrderClick("Seamless", "Redirected to Seamless storefront")}
                  className="online-partner-card p-3.5 flex items-center justify-between group"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#f43f5e] bg-[#f43f5e]/15 px-2 py-0.5 rounded-md">
                        Seamless
                      </span>
                      <span className="text-[10px] font-bold text-[#d8b4fe]">Seamless Delivery</span>
                    </div>
                    <span className="text-xs text-[#e2d9f3] font-medium mt-1">
                      Breakfast specials &amp; sandwiches
                    </span>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-[#27150c] flex items-center justify-center text-[#c084fc] group-hover:text-[#ffffff] group-hover:bg-[#7c3aed] transition-all shrink-0">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </div>
                </a>
              </div>
            </div>

            {/* SECTION 3: DIRECT PHONE CALL-IN OPTION */}
            <div className="p-4 rounded-2xl bg-[#1c0f09] border border-[#a855f7]/35 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#deb887] bg-[#deb887]/15 px-2.5 py-0.5 rounded-full inline-block">
                    ⚡ Call-In · Ready in 15–20 Mins
                  </span>
                  <h4 className="font-serif text-sm font-bold text-[#fffcf8] mt-1">
                    Direct Counter Takeout &amp; Curbside Pickup
                  </h4>
                  <p className="text-xs text-[#cbd5e1] mt-0.5">
                    Call directly for custom orders with zero 3rd-party fees: <strong className="text-[#f3e8ff]">{BUSINESS.phoneDisplay}</strong>
                  </p>
                </div>
                <a
                  href={BUSINESS.phoneHref}
                  onClick={() => trackCall("Takeout Hotline (Modal)")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-[#7c3aed] hover:bg-[#9333ea] text-[#ffffff] transition-all self-start sm:self-center shrink-0 shadow-md cursor-pointer"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call: {BUSINESS.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Operating Hours Reminder */}
        <div className="mt-4 pt-3 border-t border-[#361e12] text-center text-xs text-[#cbd5e1]">
          <p className="text-[#deb887] font-semibold">
            Mon–Sat: 6:30 AM–3:00 PM · Sun: 7:00 AM–2:00 PM
          </p>
          <p className="text-[11px] text-[#94a3b8] mt-0.5">
            41 NE 44th St. (Prospect Rd.), Oakland Park, FL 33334 · Phone: {BUSINESS.phoneDisplay}
          </p>
        </div>
      </div>
    </div>
  );
}


// Interactive Legal & Restaurant Policy Modal
function PolicyModal({
  policyId,
  onClose,
}: {
  policyId: string | null;
  onClose: () => void;
}) {
  if (!policyId) return null;
  const policy = RESTAURANT_POLICIES[policyId];
  if (!policy) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto overscroll-contain rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#24140e] to-[#140a06] border border-[#c084fc]/50 p-4 sm:p-8 text-[#fffcf8] shadow-2xl cursor-default"
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-modal-title"
      >
        {/* Glow background accents */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#a855f7]/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 h-9 w-9 rounded-full bg-[#1c0f09] border border-[#a855f7]/40 flex items-center justify-center text-[#d8b4fe] hover:text-[#fffcf8] hover:border-[#c084fc] transition-colors cursor-pointer z-10"
          aria-label="Close policy modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#4c1d95] text-[#ffffff] shadow-lg shrink-0">
            <ShieldCheck className="h-5 w-5 text-[#deb887]" />
          </div>
          <div>
            <h3 id="policy-modal-title" className="font-serif text-2xl font-black text-[#fffcf8]">
              {policy.title}
            </h3>
            <p className="text-xs font-bold uppercase tracking-wider text-[#deb887]">
              American Coffee Shop · Official Policy · Updated {policy.lastUpdated}
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-6 text-sm text-[#e2d9f3] divide-y divide-[#361e12]">
          {policy.content.map((sec, i) => (
            <div key={i} className={i > 0 ? "pt-5" : ""}>
              <h4 className="font-serif text-base font-bold text-[#f3e8ff] mb-2 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#c084fc]" />
                <span>{sec.heading}</span>
              </h4>
              <div className="space-y-2">
                {sec.text.map((para, pIdx) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Direct Contact Footer in Policy */}
        <div className="mt-8 pt-5 border-t border-[#361e12] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#d8b4fe]">
          <p>
            Questions regarding this policy? Call us at <strong className="text-[#f3e8ff]">{BUSINESS.phoneDisplay}</strong>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#7c3aed] hover:bg-[#9333ea] text-[#ffffff] font-bold transition-colors cursor-pointer"
          >
            Close &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
}

// Interactive Full Digital Diner Menu Modal (Only views when user clicks View Menu or View Drinks)
function MenuModal({
  open,
  onClose,
  initialTab = "breakfast",
  initialCategory = "all",
  onOpenOrder,
}: {
  open: boolean;
  onClose: () => void;
  initialTab?: "breakfast" | "lunch" | "drinks" | "all";
  initialCategory?: string;
  onOpenOrder: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"breakfast" | "lunch" | "drinks" | "all">(initialTab);
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
      setSelectedCat(initialCategory);
      setSearch("");
    }
  }, [open, initialTab, initialCategory]);

  const sectionsToDisplay = useMemo(() => {
    const query = search.trim().toLowerCase();

    return MENU_SECTIONS.map((section) => {
      if (query) {
        const matchingItems = section.items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            (item.spanishName && item.spanishName.toLowerCase().includes(query)) ||
            item.description.toLowerCase().includes(query) ||
            section.title.toLowerCase().includes(query)
        );
        if (matchingItems.length === 0) return null;
        return { ...section, items: matchingItems };
      }

      if (selectedCat !== "all") {
        if (section.categorySlug !== selectedCat) return null;
        return section;
      }

      if (activeTab === "drinks") {
        if (section.id !== "beverages" && section.id !== "coffee-specialties") return null;
        return section;
      }

      if (activeTab === "breakfast") {
        if (section.sectionNumber > 8) return null;
        return section;
      }

      if (activeTab === "lunch") {
        if (section.sectionNumber <= 8 || section.id === "beverages" || section.id === "coffee-specialties") {
          return null;
        }
        return section;
      }

      return section;
    }).filter(Boolean) as MenuSection[];
  }, [activeTab, selectedCat, search]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[94vh] sm:max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#24140e] via-[#1a0e08] to-[#120804] border border-[#c084fc]/50 text-[#fffcf8] shadow-2xl overflow-hidden cursor-default"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-modal-title"
      >
        {/* Sticky Modal Top Bar with Tabs and Search */}
        <div className="shrink-0 p-3.5 sm:p-5 border-b border-[#361e12] bg-[#1c0f0a]/98 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#3b0764] border border-[#a855f7]/50 text-[#ffffff] shadow-lg shrink-0">
                <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-[#deb887]" />
              </div>
              <div>
                <h3 id="menu-modal-title" className="font-serif text-base sm:text-xl md:text-2xl font-black text-[#fffcf8] leading-tight">
                  {activeTab === "drinks" ? "Drinks & Bar Menu" : "American Coffee Shop Menu"}
                </h3>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#deb887] mt-0.5">
                  All 20 Menu Categories
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-[#140b07] border border-[#a855f7]/40 flex items-center justify-center text-[#d8b4fe] hover:text-[#fffcf8] hover:border-[#c084fc] transition-colors cursor-pointer shrink-0"
              aria-label="Close menu modal"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Tab Switcher & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="menu-page-switcher">
              <button
                onClick={() => {
                  setActiveTab("breakfast");
                  setSelectedCat("all");
                  setSearch("");
                }}
                className={`menu-page-btn text-[11px] sm:text-xs md:text-sm py-1.5 px-3 sm:px-4 ${
                  activeTab === "breakfast" && selectedCat === "all" && !search ? "active" : ""
                }`}
              >
                <span>☀️ Breakfast</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("lunch");
                  setSelectedCat("all");
                  setSearch("");
                }}
                className={`menu-page-btn text-[11px] sm:text-xs md:text-sm py-1.5 px-3 sm:px-4 ${
                  activeTab === "lunch" && selectedCat === "all" && !search ? "active" : ""
                }`}
              >
                <span>🥪 Lunch &amp; Entrées</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("drinks");
                  setSelectedCat("all");
                  setSearch("");
                }}
                className={`menu-page-btn text-[11px] sm:text-xs md:text-sm py-1.5 px-3 sm:px-4 ${
                  activeTab === "drinks" && selectedCat === "all" && !search ? "active" : ""
                }`}
              >
                <Coffee className="h-3.5 w-3.5 text-[#c084fc]" />
                <span>☕ Drinks &amp; Bar</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSelectedCat("all");
                  setSearch("");
                }}
                className={`menu-page-btn text-[11px] sm:text-xs md:text-sm py-1.5 px-3 sm:px-4 hidden md:flex ${
                  activeTab === "all" && selectedCat === "all" && !search ? "active" : ""
                }`}
              >
                <span>📋 All 20 Categories</span>
              </button>
            </div>

            {/* Instant Search Bar */}
            <div className="relative min-w-[180px] sm:min-w-[210px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c084fc]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes or drinks..."
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-full bg-[#120804] border border-[#a855f7]/40 text-[#f5f0ff] placeholder-[#94a3b8] focus:outline-none focus:ring-1 focus:ring-[#c084fc]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#ffffff] cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Category Filtering Pills */}
          <div className="category-scroll-container mt-2 pt-1 border-t border-[#361e12]/60">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCat(cat.id);
                  setSearch("");
                }}
                className={`category-pill text-xs py-1 px-3 ${
                  selectedCat === cat.id ? "active" : ""
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Menu Items Content Body with Momentum Scrolling */}
        <div className="overflow-y-auto overscroll-contain p-3.5 sm:p-6 flex-1 space-y-4 sm:space-y-6 touch-pan-y">
          {sectionsToDisplay.length === 0 ? (
            <div className="text-center py-14 bg-[#1a0e08] rounded-2xl border border-[#3d2518]">
              <UtensilsCrossed className="mx-auto h-9 w-9 text-[#c084fc] mb-2" />
              <p className="font-serif text-base sm:text-lg font-bold text-[#fffcf8]">No dishes found</p>
              <p className="text-xs text-[#d8b4fe]">Try searching another item or reset filters</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCat("all");
                  setActiveTab("breakfast");
                }}
                className="mt-3 px-4 py-1.5 rounded-full bg-[#7c3aed] text-[#ffffff] text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
              {sectionsToDisplay.map((section) => (
                <div key={section.id} id={section.id} className="diner-menu-page">
                  <div className="diner-section-header">
                    <div>
                      <h4 className="diner-section-title">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7c3aed] text-[#ffffff] text-[10px] font-black">
                          {section.sectionNumber}
                        </span>
                        <span>{section.title}</span>
                      </h4>
                      {section.spanishTitle && (
                        <p className="text-[11px] font-bold italic text-[#c084fc] mt-0.5">
                          {section.spanishTitle}
                        </p>
                      )}
                    </div>
                    {section.subtitle && (
                      <span className="diner-section-subtitle text-right">
                        {section.subtitle}
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-[#321d13]">
                    {section.items.map((item) => (
                      <div key={item.id} className="diner-item-row">
                        <div className="diner-item-top">
                          <div className="diner-item-name">
                            <span>{item.name}</span>
                            {item.spanishName && (
                              <span className="text-[11px] font-normal italic text-[#c084fc]">
                                ({item.spanishName})
                              </span>
                            )}
                            {item.featuredBadge && (
                              <DishBadge type={item.featuredBadge} />
                            )}
                          </div>
                          <span className="diner-leader" aria-hidden="true" />
                          <span className="diner-item-price">{item.price}</span>
                        </div>
                        <p className="diner-item-desc">
                          {item.description}
                          {item.optionsNote && (
                            <span className="ml-2 font-medium text-[#c084fc]">
                              · {item.optionsNote}
                            </span>
                          )}
                        </p>
                      </div>
                    ))}
                  </div>

                  {section.footerNote && (
                    <div className="mt-3 pt-2 border-t border-[#321d13] text-[11px] text-[#d8b4fe] font-semibold italic">
                      ⓘ {section.footerNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Actions Bar */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-[#361e12] bg-[#140b07] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="text-[#deb887] text-center sm:text-left">
            <span className="font-semibold text-[11px] sm:text-xs">Mon–Sat: 6:30 AM–3:00 PM · Sun: 7:00 AM–2:00 PM</span>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenOrder();
              }}
              className="order-online-cool-btn px-4 py-1.5 text-xs font-extrabold cursor-pointer shadow-md"
            >
              <ShoppingBag className="online-icon-pulse h-3.5 w-3.5" />
              <span>Order Online</span>
            </button>
            <a
              href={BUSINESS.phoneHref}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#27150c] text-[#deb887] border border-[#a855f7]/30 hover:border-[#c084fc] font-bold transition-colors"
            >
              <Phone className="h-3 w-3 text-[#c084fc]" />
              <span>Call: {BUSINESS.phoneDisplay}</span>
            </a>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-full bg-[#1f120c] text-[#cbd5e1] hover:text-[#fffcf8] transition-colors cursor-pointer border border-[#3d2518]"
            >
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Header({
  onOpenMenu,
  onOpenDrinks,
  onOpenOrder,
}: {
  onOpenMenu: () => void;
  onOpenDrinks: () => void;
  onOpenOrder: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#160d08]/98 border-b border-[#361e12] shadow-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        {/* Brand Logo - American Coffee Shop */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 sm:gap-3 transition-transform hover:scale-[1.01]"
          title="American Coffee Shop — Oakland Park, FL"
        >
          {/* Steaming Coffee Cup Icon with Dark Brown & Lavender Border */}
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2d180f] to-[#180d08] border border-[#a855f7]/60 text-[#d8b4fe] shadow-md group-hover:border-[#c084fc] transition-all group-hover:scale-105 shrink-0">
            <div className="nav-steam" aria-hidden="true">
              <span className="nav-steam-wisp" />
              <span className="nav-steam-wisp" />
            </div>
            <Coffee className="h-4 w-4 sm:h-5 sm:w-5 text-[#c084fc]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#fffcf8] leading-tight group-hover:text-[#c084fc] transition-colors drop-shadow-sm">
              American Coffee Shop
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] text-[#deb887] mt-0.5 flex items-center gap-1.5">
              <Sparkles className="h-2.5 w-2.5 text-[#c084fc]" />
              <span>Oakland Park, FL · Est. Diner</span>
            </span>
          </div>
        </a>

        {/* Right Nav Links */}
        <nav className="hidden items-center gap-7 lg:gap-9 md:flex" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (link.href === "#menu") {
                  e.preventDefault();
                  onOpenMenu();
                } else if (link.href === "#drinks") {
                  e.preventDefault();
                  onOpenDrinks();
                }
              }}
              className="text-sm font-semibold text-[#f5f0ff]/80 hover:text-[#c084fc] transition-colors py-1 cursor-pointer tracking-wide"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="inline-flex h-10 w-10 items-center justify-center md:hidden rounded-lg text-[#fffcf8] hover:bg-[#28160f] cursor-pointer"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav className="border-t border-[#361e12] bg-[#160d08] px-6 py-5 md:hidden shadow-2xl" aria-label="Mobile Navigation">
          <div className="pb-3 mb-3 border-b border-[#361e12]">
            <p className="font-serif text-xl font-black text-[#fffcf8]">American Coffee Shop</p>
            <p className="text-xs font-bold uppercase tracking-wider text-[#d8b4fe]">
              Oakland Park, FL · Est. Diner
            </p>
            <p className="text-xs text-[#cbd5e1] mt-1">
              Sun: 7:00 AM–2:00 PM · Mon–Sat: 6:30 AM–3:00 PM
            </p>
          </div>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                setMobileOpen(false);
                if (link.href === "#menu") {
                  e.preventDefault();
                  onOpenMenu();
                } else if (link.href === "#drinks") {
                  e.preventDefault();
                  onOpenDrinks();
                }
              }}
              className="block py-2.5 text-base font-medium text-[#f5f0ff]/90 hover:text-[#c084fc]"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 pt-3 border-t border-[#361e12]">
            <button
              onClick={() => {
                setMobileOpen(false);
                onOpenOrder();
              }}
              className="order-online-cool-btn w-full justify-center py-3 text-sm font-extrabold cursor-pointer"
            >
              <ShoppingBag className="online-icon-pulse h-4 w-4" />
              <span>Order Online</span>
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function Home() {
  const [isSiteOnline, setIsSiteOnline] = useState<boolean>(true);
  const [statusChecked, setStatusChecked] = useState<boolean>(false);
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [menuModalTab, setMenuModalTab] = useState<"breakfast" | "lunch" | "drinks" | "all">("breakfast");
  const [menuModalCategory, setMenuModalCategory] = useState("all");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [policyModalId, setPolicyModalId] = useState<string | null>(null);

  // Monitor site online/offline status in real time
  useEffect(() => {
    setIsSiteOnline(getSiteOnlineStatus());
    setStatusChecked(true);

    const unsubscribe = subscribeSiteStatus((online) => {
      setIsSiteOnline(online);
    });
    return () => unsubscribe();
  }, []);

  // Close modals on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuModalOpen(false);
        setOrderModalOpen(false);
        setPolicyModalId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Background scroll locking when any modal is open
  useEffect(() => {
    const isAnyModalOpen = menuModalOpen || orderModalOpen || Boolean(policyModalId);
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuModalOpen, orderModalOpen, policyModalId]);

  // Automatically record website visit on page load only if site is online
  useEffect(() => {
    if (statusChecked && isSiteOnline) {
      trackVisit();
    }
  }, [statusChecked, isSiteOnline]);

  // If the site is turned OFF from the admin panel, render the offline notice screen
  if (statusChecked && !isSiteOnline) {
    return <SiteOfflineScreen onStatusChanged={setIsSiteOnline} />;
  }

  const handleOpenMenu = (
    tab: "breakfast" | "lunch" | "drinks" | "all" = "breakfast",
    cat: string = "all"
  ) => {
    trackMenuExplore(tab, `Category: ${cat}`);
    setMenuModalTab(tab);
    setMenuModalCategory(cat);
    setMenuModalOpen(true);
  };

  const handleOpenDrinks = () => {
    trackMenuExplore("Cuban Coffee & Drinks", "User opened drinks bar");
    setMenuModalTab("drinks");
    setMenuModalCategory("all");
    setMenuModalOpen(true);
  };

  const handleSelectCategoryFromModal = (catId: string) => {
    trackMenuExplore(catId, `Shortcut category from modal: ${catId}`);
    setMenuModalCategory(catId);
    setMenuModalTab(catId === "beverages" ? "drinks" : "all");
    setMenuModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#160d08] text-[#f5f0ff] selection:bg-[#a855f7]/40 selection:text-[#ffffff]">
      <Header
        onOpenMenu={() => handleOpenMenu("breakfast")}
        onOpenDrinks={handleOpenDrinks}
        onOpenOrder={() => setOrderModalOpen(true)}
      />

      {/* Online Ordering Interactive Modal */}
      <OrderOnlineModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        onSelectCategory={handleSelectCategoryFromModal}
      />

      {/* Official Full Digital Menu Modal (Only views when user clicks View Menu or View Drinks) */}
      <MenuModal
        open={menuModalOpen}
        onClose={() => setMenuModalOpen(false)}
        initialTab={menuModalTab}
        initialCategory={menuModalCategory}
        onOpenOrder={() => {
          setMenuModalOpen(false);
          setOrderModalOpen(true);
        }}
      />

      {/* Official Legal & Restaurant Policy Modal */}
      <PolicyModal
        policyId={policyModalId}
        onClose={() => setPolicyModalId(null)}
      />

      <main>
        {/* ==========================================================================
            HERO SECTION: CRISP SPANISH RESTAURANT VIBE (NO BLUR, NO WHITE WASHOUT!)
            DARK BROWN & LAVENDER PALETTE WITH COOL ANIMATED BUTTONS
            ========================================================================== */}
        <section id="home" className="relative isolate min-h-[82vh] overflow-hidden bg-[#160d08] flex items-center">
          <img
            src={spanishCafeHero}
            alt="Warm artisanal Spanish café table with café con leche latte art and fresh crusty sandwich"
            width={1920}
            height={1088}
            loading="eager"
            decoding="async"
            className="absolute inset-0 -z-10 h-full w-full object-cover object-[center_right] lg:object-right"
          />
          {/* Rich Dark Brown & Lavender Atmospheric Vignette: 100% Crisp, Never Blurry or Washed-Out White */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#160d08] via-[#160d08]/85 to-transparent md:to-[#160d08]/25" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#160d08] via-transparent to-[#160d08]/60" />
          <div className="absolute inset-0 -z-10 bg-radial-[circle_at_25%_45%] from-transparent via-[#160d08]/30 to-[#160d08]/80" />

          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
            <div className="max-w-xl lg:max-w-2xl">
              {/* Clean, Non-Congested Eyebrow */}
              <div className="mb-3">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#deb887] flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#c084fc]" />
                  <span>American &amp; Spanish Diner · Oakland Park, FL</span>
                </span>
              </div>

              {/* Bold Main Headline: American Coffee Shop */}
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#fffcf8] tracking-tight leading-[1.08] drop-shadow-lg mb-3 sm:mb-4">
                <span className="hero-title-shimmer">American Coffee Shop</span>
              </h1>

              {/* Crisp 1-line description without repetitive text */}
              <p className="text-sm sm:text-base md:text-lg text-[#e2d9f3] font-medium max-w-lg leading-relaxed drop-shadow-sm mb-6">
                Handcrafted Cuban espresso, hearty breakfast griddles, pressed sandwiches, and homestyle Spanish comfort served fresh daily.
              </p>

              {/* Clean, Responsive Hours & Location Badge (Uncluttered) */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs sm:text-sm text-[#cbd5e1] mb-7 font-medium">
                <div className="flex items-center gap-1.5 shrink-0">
                  <Clock className="h-4 w-4 text-[#c084fc]" />
                  <span>Mon–Sat: 6:30 AM–3:00 PM</span>
                </div>
                <span className="text-[#deb887]">·</span>
                <span className="text-[#deb887] font-semibold">Sun: 7:00 AM–2:00 PM</span>
                <span className="text-[#deb887]">·</span>
                <div className="flex items-center gap-1 shrink-0">
                  <MapPin className="h-3.5 w-3.5 text-[#c084fc]" />
                  <span>41 NE 44th St.</span>
                </div>
              </div>

              {/* ACTION BUTTONS: ORDER ONLINE, VIEW MENU & CALL */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-5">
                {/* 1. SUPER COOL "ORDER ONLINE" BUTTON */}
                <button
                  onClick={() => {
                    trackOrder("Website Hero", "Hero primary Order Online button");
                    setOrderModalOpen(true);
                  }}
                  className="order-online-cool-btn w-full sm:w-auto justify-center px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-black shadow-2xl cursor-pointer"
                >
                  <ShoppingBag className="online-icon-pulse h-4 w-4 text-[#ffffff]" />
                  <span>Order Online</span>
                  <Sparkles className="h-3.5 w-3.5 text-[#fde047]" />
                </button>

                {/* 2. Cool Animated View Menu Button */}
                <button
                  onClick={() => handleOpenMenu("breakfast")}
                  className="cool-menu-btn group inline-flex flex-1 sm:flex-initial items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-[#ffffff] shadow-2xl cursor-pointer"
                >
                  <UtensilsCrossed className="h-4 w-4 text-[#e9d5ff]" />
                  <span>View Menu</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-[#e9d5ff]" />
                </button>

                {/* Direct Phone Call */}
                <a
                  href={BUSINESS.phoneHref}
                  onClick={() => trackCall("Hero Header Call")}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-[#deb887]/30 hover:border-[#deb887] hover:bg-[#deb887]/10 px-5 py-3.5 text-xs sm:text-sm font-bold text-[#deb887] hover:text-[#fffcf8] transition-colors"
                >
                  <Phone className="h-4 w-4 text-[#c084fc]" />
                  <span>{BUSINESS.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            FEATURED FAVORITES (Spacious 4-Column Grid with Rich Photography)
            ========================================================================== */}
        <section id="featured" className="py-20 sm:py-24 bg-[#1a0f09] border-y border-[#3a2014]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#e9d5ff] bg-[#2d180f] border border-[#a855f7]/50">
                <Sparkles className="h-3.5 w-3.5 text-[#c084fc]" />
                <span>Customer Favorites</span>
              </span>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#fffcf8] tracking-tight">
                Featured House Picks
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#d8b4fe]">
                Our signature Cuban coffee specialties, breakfast griddles, and authentic Spanish lunch plates.
              </p>
            </div>

            {/* 12 Featured Dish Cards Grid - Spacious 4 Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
              {FEATURED_FAVORITES.map((dish) => (
                <div
                  key={dish.id}
                  className="dish-card group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2d1a12]">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <DishBadge type={dish.badge as any} />
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      <h3 className="font-serif text-base font-bold text-[#fffcf8] leading-snug group-hover:text-[#c084fc] transition-colors">
                        {dish.name}
                      </h3>
                      {dish.spanishName && (
                        <p className="text-xs italic text-[#d8b4fe] mt-0.5">
                          {dish.spanishName}
                        </p>
                      )}
                      <p className="text-xs text-[#cbd5e1] mt-2 leading-relaxed line-clamp-2">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-4 pt-3 border-t border-[#3a2014] flex items-center justify-between">
                    <span className="price-display text-sm font-black text-[#deb887]">
                      {dish.price}
                    </span>
                    <button
                      onClick={() => {
                        trackMenuExplore(dish.name, `Customer favorite dish: ${dish.name}`);
                        handleOpenMenu(dish.targetTab, dish.category);
                      }}
                      className="text-xs font-bold text-[#c084fc] hover:text-[#e9d5ff] transition-colors cursor-pointer"
                    >
                      View in Menu →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================================================
            MENU SHOWCASE & QUICK LAUNCHER (REPLACES HUGE STATIC MENU ON LANDING PAGE)
            Full menu and drinks open dynamically in high-performance digital viewer
            ========================================================================== */}
        <section id="menu-showcase" className="py-20 sm:py-24 bg-[#160d08] border-t border-[#361e12]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c084fc]">
                American Coffee Shop · Digital Diner Menu
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#fffcf8] mt-2 mb-3">
                Explore Our Full Café Menu
              </h2>
              <p className="text-sm sm:text-base text-[#d8b4fe] max-w-2xl mx-auto leading-relaxed">
                Browse all 20 diner categories. Click below to view breakfast, lunch entrées, or our dedicated Cuban coffee and drinks bar.
              </p>
            </div>

            {/* 3 Showcase Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* 1. Breakfast Pillar */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#24150e] to-[#180d08] border border-[#a855f7]/30 shadow-lg flex flex-col justify-between hover:border-[#c084fc]/60 transition-all group">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c3aed]/20 text-[#deb887] border border-[#a855f7]/40 mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-2xl">☀️</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#deb887] bg-[#deb887]/15 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Sections 1–8 · All-Day Breakfast
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#fffcf8] mb-2">
                    Breakfast &amp; Mornings
                  </h3>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed mb-4">
                    Eggs cooked to order, Belgian waffles, chocolate chip pancakes, French toast, 3-egg omelets, and savory breakfast skillets.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenMenu("breakfast")}
                  className="cool-menu-btn w-full justify-center py-2.5 text-xs font-bold shadow-md cursor-pointer"
                >
                  <span>View Breakfast Menu</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#e9d5ff]" />
                </button>
              </div>

              {/* 2. Lunch & Specialties Pillar */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#24150e] to-[#180d08] border border-[#a855f7]/30 shadow-lg flex flex-col justify-between hover:border-[#c084fc]/60 transition-all group">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c3aed]/20 text-[#deb887] border border-[#a855f7]/40 mb-4 group-hover:scale-105 transition-transform">
                    <span className="text-2xl">🥪</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#deb887] bg-[#deb887]/15 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Sections 9–17 &amp; 20 · Diner Lunch
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#fffcf8] mb-2">
                    Lunch &amp; Specialties
                  </h3>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed mb-4">
                    Authentic Cuban sandwiches on crusty bread, Palomilla steaks, Chicken &amp; Waffles, triple-decker clubs, fried seafood, and homestyle sides.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenMenu("lunch")}
                  className="cool-menu-btn w-full justify-center py-2.5 text-xs font-bold shadow-md cursor-pointer"
                >
                  <span>View Lunch Menu</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#e9d5ff]" />
                </button>
              </div>

              {/* 3. Drinks & Bar Pillar */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#24150e] to-[#180d08] border border-[#a855f7]/30 shadow-lg flex flex-col justify-between hover:border-[#c084fc]/60 transition-all group">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7c3aed]/20 text-[#c084fc] border border-[#a855f7]/40 mb-4 group-hover:scale-105 transition-transform">
                    <Coffee className="h-6 w-6 text-[#c084fc]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#deb887] bg-[#deb887]/15 px-2.5 py-0.5 rounded-full inline-block mb-2">
                    Sections 18 &amp; 19 · Espresso &amp; Bar
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#fffcf8] mb-2">
                    Drinks &amp; Cuban Coffee
                  </h3>
                  <p className="text-xs text-[#cbd5e1] leading-relaxed mb-4">
                    Home of the Cafe con Leche, Coladas, Cortaditos, iced coffee, natural tropical fruit Batidos (shakes), juices, and cold sodas.
                  </p>
                </div>
                <button
                  onClick={handleOpenDrinks}
                  className="drink-btn flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold text-[#ffffff] shadow-md cursor-pointer"
                >
                  <span className="drink-liquid-fill" />
                  <Coffee className="cup-icon h-3.5 w-3.5 text-[#c084fc] z-10" />
                  <span className="z-10">View Drinks &amp; Bar Menu</span>
                </button>
              </div>
            </div>

            {/* Central Action Bar */}
            <div className="p-6 rounded-3xl bg-[#1f110a] border border-[#3d2518] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#fffcf8]">
                  Ready to order takeout or counter pickup?
                </h4>
                <p className="text-xs text-[#deb887] mt-0.5">
                  Order online directly via Toast with zero markups, or order on Uber Eats, Grubhub &amp; Postmates.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setOrderModalOpen(true)}
                  className="order-online-cool-btn px-6 py-2.5 text-xs font-black shadow-lg cursor-pointer"
                >
                  <ShoppingBag className="online-icon-pulse h-4 w-4" />
                  <span>Order Online</span>
                </button>

                <button
                  onClick={() => handleOpenMenu("all")}
                  className="cool-menu-btn inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold text-[#ffffff] shadow-lg cursor-pointer"
                >
                  <span>View All 20 Categories</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#e9d5ff]" />
                </button>

                <a
                  href={BUSINESS.phoneHref}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#140b07] text-[#deb887] border border-[#a855f7]/30 hover:border-[#c084fc] text-xs font-bold transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>Call: {BUSINESS.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            ATMOSPHERE & HERITAGE (DARK BROWN & LAVENDER)
            ========================================================================== */}
        <section id="about" className="py-16 bg-[#1a0f09] border-y border-[#3a2014]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#a855f7]/40 aspect-[4/3]">
                  <img
                    src={atmosphereImg}
                    alt="Authentic warm diner atmosphere at American Coffee Shop"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160d08]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-[#fffcf8]">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c084fc]">
                      Oakland Park Landmark
                    </span>
                    <p className="font-serif text-xl sm:text-2xl font-bold mt-1">
                      American Coffee Shop · Home of the Cafe con Leche
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#e9d5ff] bg-[#2d180f] border border-[#a855f7]/50 w-fit mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-[#c084fc]" />
                  <span>Our Heritage &amp; Sabor</span>
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#fffcf8] leading-tight">
                  American Coffee Shop
                </h2>
                <p className="text-sm font-bold uppercase tracking-wider text-[#c084fc] mt-1">
                  American &amp; Spanish Restaurant
                </p>
                <p className="mt-4 text-sm text-[#e2d9f3] leading-relaxed">
                  Proudly serving Oakland Park with authentic Cuban espresso, hearty diner breakfasts, and homestyle Spanish cooking prepared fresh to order with genuine warmth.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#22140e] border border-[#3d2518]">
                    <span className="font-serif text-2xl font-black text-[#c084fc]">20</span>
                    <p className="text-xs font-bold text-[#f3e8ff] uppercase mt-0.5">Menu Sections</p>
                    <p className="text-[11px] text-[#d8b4fe]">Breakfast, Lunch &amp; Drinks</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#22140e] border border-[#3d2518]">
                    <span className="font-serif text-2xl font-black text-[#c084fc]">100%</span>
                    <p className="text-xs font-bold text-[#f3e8ff] uppercase mt-0.5">Real Espresso</p>
                    <p className="text-[11px] text-[#d8b4fe]">Coladas, Cortaditos &amp; Batidos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            CUSTOMER REVIEWS
            ========================================================================== */}
        <section aria-label="Customer Reviews" className="py-16 bg-[#160d08]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#c084fc]">
                Customer Love
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#fffcf8] mt-1">
                What Guests Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#22140e] border border-[#3d2518] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-[#c084fc] mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#e2d9f3] italic leading-relaxed">
                    "The Cafe con Leche and pressed Cuban sandwich are perfection! Best neighborhood diner in Broward County."
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-[#361e12]">
                  <img src={sarah} alt="Sarah M." loading="lazy" decoding="async" className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-[#fffcf8]">Sarah M.</p>
                    <p className="text-[10px] text-[#d8b4fe]">Oakland Park Local</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#22140e] border border-[#3d2518] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-[#c084fc] mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#e2d9f3] italic leading-relaxed">
                    "Generous portions, great prices, and amazing Spanish omelets. Sunday hours till 2 PM make it ideal for family brunch!"
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-[#361e12]">
                  <img src={james} alt="James T." loading="lazy" decoding="async" className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-[#fffcf8]">James T.</p>
                    <p className="text-[10px] text-[#d8b4fe]">Food Enthusiast</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#22140e] border border-[#3d2518] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex text-[#c084fc] mb-2.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#e2d9f3] italic leading-relaxed">
                    "Authentic Florida American &amp; Spanish dining done right. Fast friendly service, and the Chicken &amp; Waffles are unmatched!"
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-[#361e12]">
                  <img src={emily} alt="Emily R." loading="lazy" decoding="async" className="h-9 w-9 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-bold text-[#fffcf8]">Emily R.</p>
                    <p className="text-[10px] text-[#d8b4fe]">Fort Lauderdale, FL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
            RESTAURANT INFORMATION (BOTTOM)
            ========================================================================== */}
        <section id="location" className="py-16 bg-[#120a06] text-[#fffcf8] border-t border-[#361e12]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#c084fc]">
                  Oakland Park, FL
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black mt-1 text-[#fffcf8]">
                  AMERICAN COFFEE SHOP
                </h2>
                <p className="text-sm font-bold uppercase tracking-wider text-[#d8b4fe] mt-1 mb-6">
                  American &amp; Spanish Restaurant · Home of the Cafe con Leche
                </p>

                <div className="space-y-4 text-sm text-[#e2d9f3]">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#c084fc] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#fffcf8]">Address</p>
                      <p>41 NE 44th St. (Prospect Rd.)</p>
                      <p>Oakland Park, FL 33334</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#c084fc] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#fffcf8]">Phone</p>
                      <a
                        href={BUSINESS.phoneHref}
                        className="text-[#c084fc] hover:underline font-semibold"
                      >
                        {BUSINESS.phoneDisplay}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#c084fc] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#fffcf8]">Restaurant Hours</p>
                      <p>Monday–Saturday: 6:30 AM–3:00 PM</p>
                      <p className="text-[#deb887] font-semibold">Sunday: 7:00 AM–2:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  {/* Order Online in Location */}
                  <button
                    onClick={() => {
                      trackOrder("Location CTA", "Clicked Order Online in Location section");
                      setOrderModalOpen(true);
                    }}
                    className="order-online-cool-btn px-6 py-3 text-xs sm:text-sm font-black cursor-pointer shadow-xl"
                  >
                    <ShoppingBag className="online-icon-pulse h-4 w-4" />
                    <span>ORDER ONLINE</span>
                  </button>

                  <a
                    href={BUSINESS.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackLocationOpen("Google Maps Directions")}
                    className="cool-menu-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs sm:text-sm font-bold text-[#ffffff] shadow-lg cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 text-[#e9d5ff]" />
                    <span>GET DIRECTIONS</span>
                  </a>

                  <a
                    href={BUSINESS.phoneHref}
                    onClick={() => trackCall("Location Phone Call")}
                    className="inline-flex items-center gap-2 rounded-full border border-[#deb887]/30 hover:border-[#deb887] hover:bg-[#deb887]/10 px-5 py-3 text-xs sm:text-sm font-bold text-[#deb887] hover:text-[#fffcf8] transition-colors"
                  >
                    <Phone className="h-4 w-4 text-[#c084fc]" />
                    <span>{BUSINESS.phoneDisplay}</span>
                  </a>
                </div>

                {/* Quick Delivery Links in Location Section */}
                <div className="mt-6 pt-4 border-t border-[#361e12] flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#deb887] font-semibold flex items-center gap-1">
                    <ShoppingBag className="h-3 w-3 text-[#c084fc]" />
                    <span>Online Partners:</span>
                  </span>
                  <a
                    href="https://order.toasttab.com/online/american-coffee-shop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-pill text-[#deb887] border-[#deb887]/40 hover:border-[#deb887]"
                  >
                    Toast Tab (Official)
                  </a>
                  <a
                    href="https://toast.app/r/american-coffee-shop/order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-pill"
                  >
                    Toast App
                  </a>
                  <a
                    href="https://www.ubereats.com/store/american-coffee-shop/1-7JmPiFQ8mLIgmWCy86Wg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-pill hover:text-[#22c55e]"
                  >
                    Uber Eats
                  </a>
                  <a
                    href="https://www.grubhub.com/restaurant/american-coffee-shop-41-ne-44th-st-oakland-park/2103174"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-pill hover:text-[#f97316]"
                  >
                    Grubhub
                  </a>
                  <a
                    href="https://postmates.com/store/american-coffee-shop/1-7JmPiFQ8mLIgmWCy86Wg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-pill hover:text-[#38bdf8]"
                  >
                    Postmates
                  </a>
                  <a
                    href="https://www.seamless.com/menu/american-coffee-shop-41-ne-44th-st-oakland-park/2103174"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="partner-pill hover:text-[#f43f5e]"
                  >
                    Seamless
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-3xl border-2 border-[#a855f7]/30 shadow-2xl bg-[#22140e] aspect-[4/3]">
                  <iframe
                    title="American Coffee Shop Location"
                    src={BUSINESS.mapEmbedUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==========================================================================
          MINIMAL RESTAURANT FOOTER
          ========================================================================== */}
      <footer className="border-t border-[#2a170e] bg-[#0c0604] text-[#cbd5e1] py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[#20110a]">
            {/* Brand */}
            <a href="#home" className="inline-flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2d180f] to-[#180d08] border border-[#a855f7]/50 text-[#c084fc] shadow-sm">
                <Coffee className="h-4 w-4" />
              </div>
              <div className="text-left">
                <span className="font-serif text-base font-bold text-[#fffcf8] tracking-tight block">
                  American Coffee Shop
                </span>
                <span className="text-[11px] font-medium text-[#deb887]">
                  Oakland Park, FL · {BUSINESS.phoneDisplay}
                </span>
              </div>
            </a>

            {/* Quick Minimal Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-[#d8b4fe]">
              <a href="#home" className="hover:text-[#fffcf8] transition-colors">Home</a>
              <button onClick={() => handleOpenMenu("breakfast")} className="hover:text-[#fffcf8] transition-colors cursor-pointer">Menu</button>
              <button onClick={handleOpenDrinks} className="hover:text-[#fffcf8] transition-colors cursor-pointer">Drinks</button>
              <a href="#location" className="hover:text-[#fffcf8] transition-colors">Location</a>
              <button onClick={() => setOrderModalOpen(true)} className="text-[#deb887] hover:text-[#fffcf8] font-bold transition-colors cursor-pointer">Order Online</button>
            </div>
          </div>

          {/* Minimal Bottom Bar */}
          <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#786b86]">
            <p>
              © {new Date().getFullYear()} American Coffee Shop · 41 NE 44th St., Oakland Park, FL 33334
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <button onClick={() => setPolicyModalId("privacy")} className="hover:text-[#c084fc] transition-colors cursor-pointer">Privacy</button>
              <button onClick={() => setPolicyModalId("terms")} className="hover:text-[#c084fc] transition-colors cursor-pointer">Terms</button>
              <button onClick={() => setPolicyModalId("allergen")} className="hover:text-[#c084fc] transition-colors cursor-pointer">Food Safety &amp; Allergens</button>
              <button onClick={() => setPolicyModalId("accessibility")} className="hover:text-[#c084fc] transition-colors cursor-pointer">Accessibility</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
