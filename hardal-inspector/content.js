/**
 * Hardal Inspector — Content Script
 *
 * Injected into every page. Intercepts XHR/fetch calls to Hardal endpoints
 * as a secondary capture layer (complements the background webRequest listener).
 * Also handles page-reload signaling.
 */

(function () {
  if (window.__hardalInspectorInjected) return;
  window.__hardalInspectorInjected = true;

  const HARDAL_PATTERNS = [/hardal/i, /\/push\//i, /\/collect/i, /\/track/i];

  function isHardalUrl(url) {
    return HARDAL_PATTERNS.some((p) => p.test(url));
  }

  function notifyBackground(eventData) {
    window.postMessage(
      { source: "hardal-inspector-content", ...eventData },
      "*"
    );
  }

  // ─── Intercept fetch ───────────────────────────────────────────────────────
  const originalFetch = window.fetch;
  window.fetch = async function (...args) {
    const [input, init] = args;
    const url = typeof input === "string" ? input : input?.url || "";

    if (isHardalUrl(url) && (init?.method || "GET").toUpperCase() === "POST") {
      let body = null;
      try {
        if (typeof init?.body === "string") {
          body = JSON.parse(init.body);
        } else if (init?.body instanceof FormData) {
          body = Object.fromEntries(init.body.entries());
        }
      } catch {}

      notifyBackground({
        type: "HARDAL_FETCH_INTERCEPTED",
        url,
        method: "POST",
        payload: body,
        timestamp_ms: Date.now(),
      });
    }

    return originalFetch.apply(this, args);
  };

  // ─── Intercept XHR ────────────────────────────────────────────────────────
  const OrigXHR = window.XMLHttpRequest;
  function PatchedXHR() {
    const xhr = new OrigXHR();
    const origOpen = xhr.open.bind(xhr);
    const origSend = xhr.send.bind(xhr);
    let _url = "";
    let _method = "";

    xhr.open = function (method, url, ...rest) {
      _url = url;
      _method = method;
      return origOpen(method, url, ...rest);
    };

    xhr.send = function (body) {
      if (isHardalUrl(_url) && _method.toUpperCase() === "POST") {
        let parsed = null;
        try {
          parsed = typeof body === "string" ? JSON.parse(body) : null;
        } catch {}

        notifyBackground({
          type: "HARDAL_XHR_INTERCEPTED",
          url: _url,
          method: _method,
          payload: parsed,
          timestamp_ms: Date.now(),
        });
      }
      return origSend(body);
    };

    return xhr;
  }
  PatchedXHR.prototype = OrigXHR.prototype;
  window.XMLHttpRequest = PatchedXHR;
})();
