/**
 * Hardal Inspector — Background Service Worker (Agent 2: Data Sniffer)
 *
 * Intercepts all POST requests containing "hardal" in the URL,
 * parses the requestBody, and forwards structured event data to the popup.
 *
 * Hardal endpoint pattern: URLs containing "/push/hardal" or "hardal" keyword
 */

const HARDAL_URL_PATTERNS = ["*://*/*hardal*", "*://*/*/push/*"];

// In-memory store per tab: tabId → [events]
const eventStore = new Map();

// Badge count per tab
const badgeCount = new Map();

// ─── Helpers ────────────────────────────────────────────────────────────────

function getOrCreateTabStore(tabId) {
  if (!eventStore.has(tabId)) {
    eventStore.set(tabId, []);
    badgeCount.set(tabId, 0);
  }
  return eventStore.get(tabId);
}

function parseRequestBody(requestBody) {
  if (!requestBody) return null;

  // Handle raw bytes (most common for JSON POST bodies)
  if (requestBody.raw && requestBody.raw.length > 0) {
    try {
      const bytes = requestBody.raw[0].bytes;
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(bytes);
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  // Handle form-encoded data
  if (requestBody.formData) {
    return requestBody.formData;
  }

  return null;
}

function isHardalRequest(url) {
  try {
    const parsed = new URL(url);
    const fullUrl = url.toLowerCase();
    return (
      fullUrl.includes("hardal") ||
      fullUrl.includes("/push/") ||
      parsed.pathname.includes("/collect") ||
      parsed.pathname.includes("/track")
    );
  } catch {
    return false;
  }
}

function updateBadge(tabId) {
  const count = badgeCount.get(tabId) || 0;
  chrome.action.setBadgeText({
    text: count > 0 ? String(count) : "",
    tabId,
  });
  chrome.action.setBadgeBackgroundColor({ color: "#F5A623", tabId });
}

// ─── webRequest Listener ─────────────────────────────────────────────────────

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const { url, tabId, method, requestBody, timeStamp } = details;

    if (tabId < 0) return;
    if (!isHardalRequest(url)) return;
    if (method !== "POST" && method !== "OPTIONS") return;

    const payload = parseRequestBody(requestBody);
    if (!payload) return;

    const eventName =
      payload.event_name ||
      payload.event ||
      payload.type ||
      payload.name ||
      "unknown_event";

    const hardalEvent = {
      id: `${tabId}-${timeStamp}-${Math.random().toString(36).slice(2, 8)}`,
      event_name: eventName,
      timestamp: new Date(timeStamp).toISOString(),
      timestamp_ms: timeStamp,
      url,
      method,
      payload,
      status: "sent",
    };

    const store = getOrCreateTabStore(tabId);
    store.push(hardalEvent);

    const newCount = (badgeCount.get(tabId) || 0) + 1;
    badgeCount.set(tabId, newCount);
    updateBadge(tabId);

    // Broadcast to popup if it's open
    chrome.runtime.sendMessage({
      type: "HARDAL_EVENT",
      tabId,
      event: hardalEvent,
    }).catch(() => {
      // Popup not open — that's fine, events are persisted in store
    });
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

// Track response status for each request
chrome.webRequest.onCompleted.addListener(
  (details) => {
    const { url, tabId, statusCode, requestId } = details;
    if (tabId < 0 || !isHardalRequest(url)) return;

    const store = eventStore.get(tabId);
    if (!store) return;

    // Find the most recent event from this URL and update its status
    for (let i = store.length - 1; i >= 0; i--) {
      if (store[i].url === url && store[i].status === "sent") {
        store[i].status = String(statusCode);
        store[i].status_code = statusCode;

        chrome.runtime.sendMessage({
          type: "HARDAL_EVENT_UPDATED",
          tabId,
          eventId: store[i].id,
          status: String(statusCode),
          status_code: statusCode,
        }).catch(() => {});

        break;
      }
    }
  },
  { urls: ["<all_urls>"] }
);

// ─── Message Handlers (from Popup) ──────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { type, tabId } = message;

  if (type === "GET_EVENTS") {
    const events = eventStore.get(tabId) || [];
    sendResponse({ events });
    return true;
  }

  if (type === "CLEAR_EVENTS") {
    eventStore.set(tabId, []);
    badgeCount.set(tabId, 0);
    updateBadge(tabId);
    sendResponse({ ok: true });
    return true;
  }

  if (type === "GET_BADGE_COUNT") {
    sendResponse({ count: badgeCount.get(tabId) || 0 });
    return true;
  }
});

// ─── Tab lifecycle ───────────────────────────────────────────────────────────

// Reset on page reload
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    eventStore.set(tabId, []);
    badgeCount.set(tabId, 0);
    updateBadge(tabId);
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  eventStore.delete(tabId);
  badgeCount.delete(tabId);
});
