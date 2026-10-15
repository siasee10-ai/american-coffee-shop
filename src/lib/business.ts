export const BUSINESS = {
  name: "American Coffee Shop",
  subtitle: "American & Spanish Restaurant",
  tagline: "Home of the Cafe con Leche · American & Spanish Restaurant",
  street: "41 NE 44th St. (Prospect Rd.)",
  city: "Oakland Park",
  region: "FL",
  zip: "33334",
  country: "US",
  phoneDisplay: "+1 (954) 772-8850",
  phoneHref: "tel:+19547728850",
  directionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=41+NE+44th+St,+Oakland+Park,+FL+33334",
  mapEmbedUrl:
    "https://www.google.com/maps?q=41+NE+44th+St,+Oakland+Park,+FL+33334&output=embed",
  rating: 4.8,
  reviewCount: 785,
  priceRange: "$$",
  hours: {
    weekday: "Monday–Saturday: 6:30 AM–3:00 PM",
    sunday: "Sunday: 7:00 AM–2:00 PM",
  },
  menuUrl: "#menu",
  orderOnline: {
    toastTab: "https://order.toasttab.com/online/american-coffee-shop",
    toastApp: "https://toast.app/r/american-coffee-shop/order",
    uberEats: "https://www.ubereats.com/store/american-coffee-shop/1-7JmPiFQ8mLIgmWCy86Wg",
    postmates: "https://postmates.com/store/american-coffee-shop/1-7JmPiFQ8mLIgmWCy86Wg",
    grubhub: "https://www.grubhub.com/restaurant/american-coffee-shop-41-ne-44th-st-oakland-park/2103174",
    seamless: "https://www.seamless.com/menu/american-coffee-shop-41-ne-44th-st-oakland-park/2103174",
  },
};

export interface OrderPlatform {
  id: string;
  name: string;
  category: "Direct Online" | "Delivery & Pickup";
  description: string;
  url: string;
  badge?: string;
  badgeColor?: string;
  isOfficial?: boolean;
}

export const ORDER_PLATFORMS: OrderPlatform[] = [
  {
    id: "toast-tab",
    name: "Toast Tab",
    category: "Direct Online",
    description: "Official restaurant online store · Lowest fees & quickest pickup turnaround.",
    url: "https://order.toasttab.com/online/american-coffee-shop",
    badge: "RECOMMENDED · OFFICIAL",
    badgeColor: "#deb887",
    isOfficial: true,
  },
  {
    id: "toast-app",
    name: "Toast App",
    category: "Direct Online",
    description: "Order conveniently through the Toast mobile app.",
    url: "https://toast.app/r/american-coffee-shop/order",
    badge: "MOBILE APP",
    badgeColor: "#c084fc",
    isOfficial: true,
  },
  {
    id: "uber-eats",
    name: "Uber Eats",
    category: "Delivery & Pickup",
    description: "Full diner menu delivered right to your doorstep via Uber Eats.",
    url: "https://www.ubereats.com/store/american-coffee-shop/1-7JmPiFQ8mLIgmWCy86Wg",
    badge: "DELIVERY & TAKEOUT",
    badgeColor: "#22c55e",
  },
  {
    id: "grubhub",
    name: "Grubhub",
    category: "Delivery & Pickup",
    description: "Order American Coffee Shop breakfast & lunch favorites on Grubhub.",
    url: "https://www.grubhub.com/restaurant/american-coffee-shop-41-ne-44th-st-oakland-park/2103174",
    badge: "POPULAR",
    badgeColor: "#f97316",
  },
  {
    id: "postmates",
    name: "Postmates",
    category: "Delivery & Pickup",
    description: "Fast local delivery and on-demand pickup via Postmates.",
    url: "https://postmates.com/store/american-coffee-shop/1-7JmPiFQ8mLIgmWCy86Wg",
    badge: "DELIVERY",
    badgeColor: "#38bdf8",
  },
  {
    id: "seamless",
    name: "Seamless",
    category: "Delivery & Pickup",
    description: "Seamless online ordering for all American & Spanish specialties.",
    url: "https://www.seamless.com/menu/american-coffee-shop-41-ne-44th-st-oakland-park/2103174",
    badge: "DELIVERY",
    badgeColor: "#f43f5e",
  },
];
