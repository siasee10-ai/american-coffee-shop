import React, { useEffect, useState } from "react";
import {
  Coffee,
  Phone,
  MapPin,
  Clock,
  ShieldAlert,
  RefreshCw,
  ExternalLink,
  Lock,
  ArrowRight,
} from "lucide-react";
import { BUSINESS } from "@/lib/business";
import { getSiteOnlineStatus, subscribeSiteStatus } from "@/lib/siteStatus";

interface SiteOfflineScreenProps {
  onStatusChanged?: (isOnline: boolean) => void;
}

export function SiteOfflineScreen({ onStatusChanged }: SiteOfflineScreenProps) {
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSiteStatus((online) => {
      if (online && onStatusChanged) {
        onStatusChanged(true);
      }
    });
    return () => unsubscribe();
  }, [onStatusChanged]);

  const handleManualCheck = () => {
    setChecking(true);
    setTimeout(() => {
      const isOnline = getSiteOnlineStatus();
      setChecking(false);
      if (isOnline && onStatusChanged) {
        onStatusChanged(true);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#100906] text-[#f5f0ff] flex flex-col justify-between selection:bg-[#deb887]/30">
      {/* Top Banner Bar */}
      <header className="border-b border-[#2b160d] bg-[#170c07]/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#381c10] to-[#1c0f08] border border-[#deb887]/40 flex items-center justify-center text-[#deb887] shadow-lg">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-lg font-black tracking-tight text-[#fffcf8] block leading-tight">
                American Coffee Shop
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#deb887]">
                Oakland Park, Florida
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#ef4444]/15 text-[#fca5a5] border border-[#ef4444]/30">
              <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-pulse" />
              Site Offline
            </span>
          </div>
        </div>
      </header>

      {/* Main Notice Centerpiece */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-2xl text-center space-y-6">
          {/* Beacon Icon */}
          <div className="inline-flex relative">
            <div className="absolute -inset-4 rounded-full bg-[#ef4444]/10 blur-xl animate-pulse" />
            <div className="h-20 w-20 rounded-3xl bg-[#23120a] border-2 border-[#ef4444]/50 flex items-center justify-center text-[#f87171] shadow-2xl relative">
              <ShieldAlert className="h-10 w-10 text-[#ef4444]" />
            </div>
          </div>

          {/* Headline & Description */}
          <div className="space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#fffcf8] tracking-tight">
              Website Temporarily Offline
            </h1>
            <p className="text-sm sm:text-base text-[#cbd5e1] max-w-lg mx-auto leading-relaxed">
              American Coffee Shop&apos;s digital portal is currently powered down for routine maintenance or scheduled updates. We will be back online shortly.
            </p>
          </div>

          {/* Diner Status & In-Person Notice */}
          <div className="rounded-3xl bg-[#1c0f09] border border-[#381c10] p-6 sm:p-8 text-left shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#2d180e]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#fffcf8]">
                  Kitchen &amp; Dining Room Are Still Open!
                </h3>
                <p className="text-xs text-[#a89bb8] mt-0.5">
                  Visit us in person or call directly to place takeout orders:
                </p>
              </div>
              <span className="hidden sm:inline-flex text-[11px] font-bold text-[#4ade80] bg-[#22c55e]/15 border border-[#22c55e]/30 px-3 py-1 rounded-full">
                Dine-In &amp; Takeout Open
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Order Card */}
              <a
                href={BUSINESS.phoneHref}
                className="group p-4 rounded-2xl bg-[#25140c] border border-[#a855f7]/30 hover:border-[#deb887] transition-all flex items-start gap-3.5"
              >
                <div className="h-10 w-10 rounded-xl bg-[#deb887]/15 text-[#deb887] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89bb8] block">
                    Call Direct For Orders
                  </span>
                  <span className="font-serif text-base font-bold text-[#fffcf8] group-hover:text-[#deb887] transition-colors">
                    {BUSINESS.phoneDisplay}
                  </span>
                  <p className="text-[11px] text-[#cbd5e1] mt-0.5">
                    Fast takeout &amp; table reservations
                  </p>
                </div>
              </a>

              {/* Physical Location Card */}
              <a
                href={BUSINESS.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-[#25140c] border border-[#a855f7]/30 hover:border-[#deb887] transition-all flex items-start gap-3.5"
              >
                <div className="h-10 w-10 rounded-xl bg-[#c084fc]/15 text-[#c084fc] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#a89bb8] block">
                    Visit Our Diner
                  </span>
                  <span className="font-serif text-sm font-bold text-[#fffcf8] group-hover:text-[#deb887] transition-colors leading-snug block">
                    41 NE 44th St (Prospect Rd)
                  </span>
                  <p className="text-[11px] text-[#cbd5e1] mt-0.5">
                    Oakland Park, FL 33334
                  </p>
                </div>
              </a>
            </div>

            {/* Operating Hours Reminder */}
            <div className="pt-2 text-xs text-[#a89bb8] flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#deb887]" />
                <span>Mon–Sat: 6:00 AM – 3:00 PM · Sun: 7:00 AM – 2:00 PM</span>
              </div>
              <span className="text-[11px] text-[#deb887] font-semibold">
                Serving breakfast &amp; lunch daily
              </span>
            </div>
          </div>

          {/* Auto Refresh Checker Action */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleManualCheck}
              disabled={checking}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25140c] border border-[#deb887]/40 hover:border-[#deb887] text-xs font-bold text-[#deb887] hover:bg-[#341b10] transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${checking ? "animate-spin" : ""}`} />
              <span>{checking ? "Checking Status..." : "Check If Site Is Back ON"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#25130b] bg-[#0c0604] py-6 px-6 text-center text-xs text-[#716480]">
        <div className="mx-auto max-w-6xl text-center">
          <p>
            © {new Date().getFullYear()} American Coffee Shop · 41 NE 44th St., Oakland Park, FL 33334
          </p>
        </div>
      </footer>
    </div>
  );
}
