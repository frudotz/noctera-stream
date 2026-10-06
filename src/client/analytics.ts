// Analytics client — loaded asynchronously on every page (type="module", after the content).
// It never blocks rendering or navigation and fails silently: if anything here breaks or the
// collector is down, the site works exactly the same.
//
// 1. NOCTERA first-party analytics (source of truth): pageviews, internal/outbound clicks,
//    visible-time engagement → analytics.noctera.stream/collect. Random pseudonymous IDs only.
// 2. Google Analytics 4 and Yandex Metrica (optional, complementary): loaded after the page
//    is idle, only when an ID is configured in src/data/analytics.ts.
//
// Opt out on this browser (e.g. the NOCTERA team): visit any page with ?analytics=off
// (and ?analytics=on to undo).
import { analytics as config } from "../data/analytics";

type Dict = Record<string, unknown>;
type Session = { id: string; last: number; seq: number; lp: string | null; land: string; a: Attribution };
type Attribution = { r: string; u: Dict; k?: string };

const w = window as unknown as Dict & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number } };
const VISITOR_KEY = "nx_v";
const SESSION_KEY = "nx_s";
const OPT_OUT_KEY = "nx_optout";
const UTM_KEYS = ["source", "medium", "campaign", "content", "term"];
const CLICK_IDS = ["gclid", "gbraid", "wbraid", "msclkid", "yclid", "fbclid", "igshid", "ttclid"];

// ---------- storage (fails soft: private modes / blocked storage) ----------
const memory: Dict = {};
function load<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return (memory[key] as T) ?? null;
  }
}
function save(key: string, value: unknown) {
  memory[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

/** 128 random bits, base64url (22 chars). Not derived from anything about the device. */
function randomId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function landingAttribution(): Attribution {
  const params = new URLSearchParams(location.search);
  const u: Dict = {};
  for (const k of UTM_KEYS) {
    const v = params.get(`utm_${k}`);
    if (v) u[k] = v.slice(0, 150);
  }
  // Only the referrer's scheme + host leave the browser: never its path or query.
  let r = "";
  try {
    if (document.referrer) {
      const ref = new URL(document.referrer);
      r = `${ref.protocol}//${ref.host}/`;
    }
  } catch {
    /* ignore */
  }
  return { r, u, k: CLICK_IDS.find((k) => params.has(k)) };
}

function start() {
  const timeout = config.sessionTimeoutMinutes * 60_000;
  let visitor = load<{ id: string }>(VISITOR_KEY);
  let newVisitor = 0;
  if (!visitor) {
    visitor = { id: randomId() };
    newVisitor = 1;
    save(VISITOR_KEY, visitor);
  }

  /** The current session, starting a new one after inactivity or when a new campaign arrives. */
  function session(isLanding: boolean): { s: Session; fresh: boolean } {
    const now = Date.now();
    let s = load<Session>(SESSION_KEY);
    const a = isLanding ? landingAttribution() : null;
    const newCampaign = !!a && Object.keys(a.u).length > 0 && JSON.stringify(a.u) !== JSON.stringify(s?.a.u);
    const fresh = !s || now - s.last > timeout || newCampaign;
    if (fresh) s = { id: randomId(), last: now, seq: 0, lp: null, land: location.pathname, a: a ?? { r: "", u: {} } };
    s!.last = now;
    return { s: s!, fresh };
  }

  // ---------- transport ----------
  function send(s: Session, events: Dict[], unloading = false) {
    if (!config.collectorUrl) return;
    const body = JSON.stringify({
      v: 1,
      vid: visitor!.id,
      sid: s.id,
      nv: newVisitor,
      lang: navigator.language,
      tz: new Date().getTimezoneOffset(),
      // iPadOS Safari reports itself as a Mac; a touch screen tells them apart.
      tm: /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1 ? 1 : 0,
      a: { ...s.a, l: s.land },
      e: events.map((e) => ({ id: randomId(), h: location.hostname, q: ++s.seq, ...e })),
    });
    save(SESSION_KEY, s);
    newVisitor = 0;
    // text/plain keeps this a CORS "simple" request (no preflight).
    const blob = new Blob([body], { type: "text/plain" });
    try {
      if (unloading && navigator.sendBeacon?.(config.collectorUrl, blob)) return;
      void fetch(config.collectorUrl, { method: "POST", body: blob, keepalive: true, credentials: "omit", mode: "cors" }).catch(() => {});
    } catch {
      /* never surface analytics errors */
    }
  }

  // ---------- pageviews ----------
  let pagePath = location.pathname;
  function pageview() {
    const { s } = session(true);
    pagePath = location.pathname;
    send(s, [{ t: "pageview", p: pagePath, ti: document.title.slice(0, 200), pp: s.lp }]);
    s.lp = pagePath;
    save(SESSION_KEY, s);
  }
  pageview();
  // Back/forward cache restores are real page views (e.g. Home → Release → back to Home).
  addEventListener("pageshow", (e) => {
    if ((e as PageTransitionEvent).persisted) {
      visibleSince = Date.now();
      engaged = 0;
      pageview();
    }
  });

  // ---------- clicks ----------
  function onClick(event: MouseEvent) {
    if (event.type === "auxclick" && event.button !== 1) return;
    const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!link) return;
    let url: URL;
    try {
      url = new URL(link.href, location.href);
    } catch {
      return;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return;
    const internal = config.hostnames.includes(url.hostname as (typeof config.hostnames)[number]);
    if (internal && url.pathname === location.pathname) return; // in-page anchor
    const text = (link.getAttribute("aria-label") || link.textContent || "").replace(/\s*\(opens in a new tab\)/i, "").replace(/\s+/g, " ").trim().slice(0, 100);
    const linkId = (link.dataset.analyticsId || link.id || link.classList[0] || "").slice(0, 60);
    const { s } = session(false);
    send(s, [{ t: "click", p: location.pathname, u: internal ? url.origin + url.pathname : url.href.split("#")[0], x: text, li: linkId }], true);
    thirdPartyClick(internal, url, text, linkId);
  }
  document.addEventListener("click", onClick, { capture: true, passive: true });
  document.addEventListener("auxclick", onClick, { capture: true, passive: true });

  // ---------- engagement (visible time; no heartbeat unless configured) ----------
  let visibleSince = document.visibilityState === "visible" ? Date.now() : 0;
  let engaged = 0;
  function flush(unloading: boolean) {
    if (!config.trackEngagement) return;
    if (visibleSince) {
      engaged += Date.now() - visibleSince;
      visibleSince = document.visibilityState === "visible" && !unloading ? Date.now() : 0;
    }
    if (engaged < 1000) return;
    const { s } = session(false);
    send(s, [{ t: "engagement", p: pagePath, ms: Math.round(engaged) }], unloading);
    engaged = 0;
  }
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
    else {
      visibleSince = Date.now();
      // Coming back after the session expired starts a new visit on this page.
      const stored = load<Session>(SESSION_KEY);
      if (!stored || Date.now() - stored.last > timeout) pageview();
    }
  });
  addEventListener("pagehide", () => flush(true));
  if (config.heartbeatSeconds > 0) {
    setInterval(() => document.visibilityState === "visible" && flush(false), Math.max(15, config.heartbeatSeconds) * 1000);
  }
}

// ---------- third-party providers ----------

const PLATFORMS: [RegExp, string][] = [
  [/(^|\.)spotify\.(com|link)$/, "Spotify"],
  [/^music\.apple\.com$/, "Apple Music"],
  [/^music\.youtube\.com$/, "YouTube Music"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "YouTube"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)soundcloud\.com$/, "SoundCloud"],
  [/(^|\.)deezer\.com$/, "Deezer"],
  [/^music\.amazon\./, "Amazon Music"],
  [/(^|\.)(x|twitter)\.com$/, "X"],
  [/^(t\.me|telegram\.me)$/, "Telegram"],
  [/(^|\.)discord\.(com|gg)$/, "Discord"],
];
const platformOf = (host: string) => PLATFORMS.find(([re]) => re.test(host))?.[1] ?? host.replace(/^www\./, "");

let gaReady = false;

/** URL for GA4 without query parameters other than UTM/gclid (no arbitrary or sensitive query strings). */
function cleanLocation(): string {
  const params = new URLSearchParams(location.search);
  const kept = new URLSearchParams();
  for (const [k, v] of params) if (k.startsWith("utm_") || k === "gclid") kept.set(k, v.slice(0, 150));
  const q = kept.toString();
  return `${location.origin}${location.pathname}${q ? `?${q}` : ""}`;
}

function loadScript(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.append(s);
}

function startGa4(id: string) {
  w.dataLayer = w.dataLayer || [];
  // gtag.js only accepts the `arguments` object, so this must be a classic function.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", id, {
    page_location: cleanLocation(),
    // Host-only cookies: GA cookies are not sent to analytics.noctera.stream or other subdomains.
    cookie_domain: "none",
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
  // GA4 attributes UTMs itself; this event additionally records the full UTM set once per landing.
  const params = new URLSearchParams(location.search);
  const utm: Dict = {};
  for (const k of UTM_KEYS) if (params.get(`utm_${k}`)) utm[`utm_${k}`] = params.get(`utm_${k}`)!.slice(0, 100);
  if (Object.keys(utm).length) w.gtag("event", "campaign_landing", utm);
  loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
  gaReady = true;
}

function startYandex(id: string) {
  type Ym = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
  // Yandex's queue stub: tag.js replays the queued `arguments` objects once loaded.
  const stub: Ym = function () {
    // eslint-disable-next-line prefer-rest-params
    (stub.a = stub.a || []).push(arguments);
  };
  stub.l = Date.now();
  const ym = w.ym || stub;
  w.ym = ym;
  loadScript(`https://mc.yandex.ru/metrika/tag.js?id=${encodeURIComponent(id)}`);
  // Native link tracking covers outbound clicks; no duplicate custom goals are sent.
  ym(Number(id), "init", {
    ssr: true,
    clickmap: config.yandexMetrica.clickmap,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: config.yandexMetrica.webvisor,
    trackHash: false,
  });
}

/**
 * GA4 custom events (GA4's own outbound-click tracking should be off — see the README).
 * link_text / link_id / link_url / link_domain use GA4's standard parameter names, so they fill the
 * predefined "Link …" dimensions. Only platform, source_page and destination_page are NOCTERA-specific
 * and registered as event-scoped custom dimensions.
 */
function thirdPartyClick(internal: boolean, url: URL, text: string, linkId: string) {
  if (!gaReady || !w.gtag) return;
  if (internal) {
    w.gtag("event", "internal_link_click", { source_page: location.pathname, destination_page: url.pathname, link_text: text, link_id: linkId });
  } else {
    w.gtag("event", "outbound_link_click", {
      source_page: location.pathname,
      link_domain: url.hostname.replace(/^www\./, ""),
      link_url: url.origin + url.pathname,
      link_text: text,
      platform: platformOf(url.hostname),
      link_id: linkId,
    });
  }
}

function startThirdParty() {
  const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
  if (config.respectGlobalPrivacyControl && gpc) return;
  if (config.ga4.measurementId) startGa4(config.ga4.measurementId);
  if (config.yandexMetrica.counterId) startYandex(config.yandexMetrica.counterId);
}

// ---------- boot ----------
function optedOut(): boolean {
  const toggle = new URLSearchParams(location.search).get("analytics");
  try {
    if (toggle === "off") localStorage.setItem(OPT_OUT_KEY, "1");
    if (toggle === "on") localStorage.removeItem(OPT_OUT_KEY);
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return toggle === "off";
  }
}

try {
  if ((config.hostnames as readonly string[]).includes(location.hostname) && !optedOut()) {
    start();
    // Third-party scripts wait until the page has loaded and the browser is idle.
    const later = () => ("requestIdleCallback" in w ? requestIdleCallback(startThirdParty, { timeout: 4000 }) : setTimeout(startThirdParty, 1500));
    if (document.readyState === "complete") later();
    else addEventListener("load", later, { once: true });
  }
} catch {
  /* analytics must never break the page */
}

export {};
