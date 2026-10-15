// Site Status Manager: Controls whether the public website is Online (active) or Offline (paused)

const STORAGE_KEY = "acs_site_is_online";
const EVENT_NAME = "acs_site_status_updated";

/**
 * Returns true if the website is Online (normal operation),
 * or false if the website has been toggled OFF (offline maintenance mode).
 */
export function getSiteOnlineStatus(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return true; // Default to online
    return raw === "true";
  } catch (err) {
    console.error("Failed to read site status:", err);
    return true;
  }
}

/**
 * Updates the site status (online or offline), persists to localStorage,
 * and notifies all active components and browser tabs.
 */
export function setSiteOnlineStatus(online: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, online ? "true" : "false");
    
    // Dispatch in current window
    window.dispatchEvent(
      new CustomEvent(EVENT_NAME, { detail: { online } })
    );
  } catch (err) {
    console.error("Failed to update site status:", err);
  }
}

/**
 * Subscribes to site status changes across custom events and multi-tab storage events.
 */
export function subscribeSiteStatus(callback: (online: boolean) => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleCustomEvent = (e: any) => {
    if (e.detail && typeof e.detail.online === "boolean") {
      callback(e.detail.online);
    } else {
      callback(getSiteOnlineStatus());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(e.newValue !== "false");
    }
  };

  window.addEventListener(EVENT_NAME, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(EVENT_NAME, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
