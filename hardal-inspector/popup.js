/**
 * Hardal Inspector — Popup Script (Agent 3: Frontend/UI)
 * Manages the event list, detail panel, filtering, and real-time updates.
 */

// ─── State ───────────────────────────────────────────────────────────────────

let allEvents = [];
let selectedEventId = null;
let currentTabId = null;
let searchQuery = "";

// ─── DOM refs ────────────────────────────────────────────────────────────────

const eventList     = document.getElementById("eventList");
const emptyState    = document.getElementById("emptyState");
const eventCount    = document.getElementById("eventCount");
const searchInput   = document.getElementById("searchInput");
const clearSearch   = document.getElementById("clearSearch");
const clearBtn      = document.getElementById("clearBtn");
const detailEventName = document.getElementById("detailEventName");
const detailStatus  = document.getElementById("detailStatus");
const detailMeta    = document.getElementById("detailMeta");
const jsonTree      = document.getElementById("jsonTree");
const copyPayloadBtn = document.getElementById("copyPayloadBtn");

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("tr-TR", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
    + "." + String(d.getMilliseconds()).padStart(3, "0");
}

function statusClass(status) {
  if (!status || status === "sent") return "status-pend";
  const code = parseInt(status, 10);
  if (code >= 200 && code < 300) return "status-ok";
  return "status-err";
}

function statusLabel(status) {
  if (!status || status === "sent") return "…";
  return status;
}

// ─── JSON Tree Renderer ───────────────────────────────────────────────────────

function isUrl(str) {
  try { return /^https?:\/\//.test(str); } catch { return false; }
}

function renderValue(val, depth = 0) {
  if (val === null || val === undefined) {
    const s = document.createElement("span");
    s.className = "json-val-null";
    s.textContent = "null";
    return s;
  }

  if (typeof val === "boolean") {
    const s = document.createElement("span");
    s.className = "json-val-boolean";
    s.textContent = String(val);
    return s;
  }

  if (typeof val === "number") {
    const s = document.createElement("span");
    s.className = "json-val-number";
    s.textContent = String(val);
    return s;
  }

  if (typeof val === "string") {
    if (isUrl(val)) {
      const s = document.createElement("span");
      s.className = "json-val-url";
      s.textContent = `"${val}"`;
      s.title = val;
      return s;
    }
    const s = document.createElement("span");
    s.className = "json-val-string";
    s.textContent = `"${val}"`;
    return s;
  }

  if (typeof val === "object") {
    return renderObject(val, depth);
  }

  const s = document.createElement("span");
  s.textContent = String(val);
  return s;
}

function renderObject(obj, depth = 0) {
  const container = document.createElement("div");

  if (depth > 0) {
    container.className = "json-nested";
  }

  const entries = Array.isArray(obj)
    ? obj.map((v, i) => [String(i), v])
    : Object.entries(obj);

  for (const [key, val] of entries) {
    const isComplex = val !== null && typeof val === "object";

    const row = document.createElement("div");
    row.className = "json-row";

    const keyEl = document.createElement("span");
    keyEl.className = "json-key";
    keyEl.textContent = key;
    row.appendChild(keyEl);

    const colon = document.createElement("span");
    colon.className = "json-colon";
    colon.textContent = ":";
    row.appendChild(colon);

    if (isComplex) {
      const typeLabel = document.createElement("span");
      typeLabel.className = "json-val-object";
      const count = Array.isArray(val) ? val.length : Object.keys(val).length;
      typeLabel.textContent = Array.isArray(val) ? `[${count}]` : `{${count}}`;
      row.appendChild(typeLabel);
      container.appendChild(row);
      container.appendChild(renderObject(val, depth + 1));
    } else {
      row.appendChild(renderValue(val, depth));
      container.appendChild(row);
    }
  }

  return container;
}

// ─── Event List Rendering ─────────────────────────────────────────────────────

function buildEventItem(event, isNew = false) {
  const li = document.createElement("li");
  li.className = `event-item${isNew ? " new" : ""}`;
  li.dataset.id = event.id;

  const nameEl = document.createElement("div");
  nameEl.className = "event-name";
  nameEl.textContent = event.event_name;

  const metaEl = document.createElement("div");
  metaEl.className = "event-meta";

  const timeEl = document.createElement("span");
  timeEl.className = "event-time";
  timeEl.textContent = formatTime(event.timestamp);

  const badge = document.createElement("span");
  badge.className = `status-badge ${statusClass(event.status)}`;
  badge.textContent = statusLabel(event.status);
  badge.dataset.statusFor = event.id;

  metaEl.append(timeEl, badge);
  li.append(nameEl, metaEl);

  li.addEventListener("click", () => selectEvent(event.id));
  return li;
}

function applyFilter() {
  const q = searchQuery.toLowerCase();
  let visible = 0;

  for (const li of eventList.querySelectorAll(".event-item")) {
    const eventId = li.dataset.id;
    const event = allEvents.find((e) => e.id === eventId);
    if (!event) continue;

    const match =
      !q ||
      event.event_name.toLowerCase().includes(q) ||
      JSON.stringify(event.payload).toLowerCase().includes(q);

    li.classList.toggle("hidden", !match);
    if (match) visible++;
  }

  emptyState.style.display = visible === 0 && allEvents.length === 0 ? "flex" : "none";
  eventCount.textContent = `${visible} event`;
}

function renderAllEvents() {
  eventList.innerHTML = "";
  for (const ev of allEvents) {
    eventList.appendChild(buildEventItem(ev, false));
  }
  applyFilter();
}

function addEventToList(event) {
  allEvents.push(event);
  const li = buildEventItem(event, true);
  eventList.appendChild(li);
  applyFilter();
  // Auto-scroll to bottom
  li.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function selectEvent(id) {
  selectedEventId = id;

  // Highlight active
  for (const li of eventList.querySelectorAll(".event-item")) {
    li.classList.toggle("active", li.dataset.id === id);
  }

  const event = allEvents.find((e) => e.id === id);
  if (!event) return;

  detailEventName.textContent = event.event_name;

  detailStatus.textContent = statusLabel(event.status);
  detailStatus.className = `detail-badge ${statusClass(event.status)}`;

  detailMeta.textContent = `${formatTime(event.timestamp)}  ·  ${new URL(event.url).hostname}`;

  // Render JSON tree
  jsonTree.innerHTML = "";
  if (event.payload) {
    jsonTree.appendChild(renderObject(event.payload));
  } else {
    const p = document.createElement("span");
    p.className = "detail-placeholder";
    p.textContent = "Payload verisi bulunamadı.";
    jsonTree.appendChild(p);
  }
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

copyPayloadBtn.addEventListener("click", () => {
  const event = allEvents.find((e) => e.id === selectedEventId);
  if (!event?.payload) return;

  navigator.clipboard.writeText(JSON.stringify(event.payload, null, 2)).then(() => {
    copyPayloadBtn.classList.add("copied");
    copyPayloadBtn.childNodes[1].textContent = " Kopyalandı!";
    setTimeout(() => {
      copyPayloadBtn.classList.remove("copied");
      copyPayloadBtn.childNodes[1].textContent = " Kopyala";
    }, 1800);
  });
});

// ─── Search ───────────────────────────────────────────────────────────────────

searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim();
  clearSearch.classList.toggle("visible", searchQuery.length > 0);
  applyFilter();
});

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  clearSearch.classList.remove("visible");
  applyFilter();
});

// ─── Clear Button ─────────────────────────────────────────────────────────────

clearBtn.addEventListener("click", () => {
  if (!currentTabId) return;
  chrome.runtime.sendMessage({ type: "CLEAR_EVENTS", tabId: currentTabId }, () => {
    allEvents = [];
    selectedEventId = null;
    eventList.innerHTML = "";
    detailEventName.textContent = "—";
    detailStatus.textContent = "—";
    detailStatus.className = "detail-badge";
    detailMeta.textContent = "";
    jsonTree.innerHTML = '<span class="detail-placeholder">Listeden bir event seçin</span>';
    applyFilter();
  });
});

// ─── Real-time Updates ────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "HARDAL_EVENT" && message.tabId === currentTabId) {
    addEventToList(message.event);
  }

  if (message.type === "HARDAL_EVENT_UPDATED" && message.tabId === currentTabId) {
    const event = allEvents.find((e) => e.id === message.eventId);
    if (event) {
      event.status = message.status;
      event.status_code = message.status_code;
      // Update badge in list
      const badge = eventList.querySelector(`[data-status-for="${message.eventId}"]`);
      if (badge) {
        badge.className = `status-badge ${statusClass(message.status)}`;
        badge.textContent = statusLabel(message.status);
      }
      // Update detail panel if this is the selected event
      if (selectedEventId === message.eventId) {
        detailStatus.textContent = statusLabel(message.status);
        detailStatus.className = `detail-badge ${statusClass(message.status)}`;
      }
    }
  }
});

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  currentTabId = tab.id;

  // Load persisted events
  chrome.runtime.sendMessage({ type: "GET_EVENTS", tabId: currentTabId }, (res) => {
    if (res?.events?.length) {
      for (const ev of res.events) {
        allEvents.push(ev);
      }
      renderAllEvents();
      // Auto-select last event
      if (allEvents.length > 0) {
        selectEvent(allEvents[allEvents.length - 1].id);
      }
    } else {
      emptyState.style.display = "flex";
      eventCount.textContent = "0 event";
    }
  });
}

init();
