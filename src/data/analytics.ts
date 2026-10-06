/**
 * Analytics configuration — PUBLIC by design. Nothing here is a secret.
 *
 * - The collector URL is NOCTERA's own first-party analytics endpoint (the source of truth).
 * - The GA4 Measurement ID ("G-…") and the Yandex Metrica counter ID (digits) are public
 *   client-side identifiers that every visitor's browser receives anyway. They are NOT
 *   passwords or API keys and must never be used to protect anything.
 *
 * Admin credentials, API tokens, bot tokens and webhook URLs never belong in this repository:
 * they live as Cloudflare Worker secrets in the private noctera-analytics repository.
 *
 * Each provider can be switched off independently by leaving its value empty. GA4 and Yandex
 * can also be set at build time without editing this file, through the repository variables
 * GA4_MEASUREMENT_ID and YANDEX_METRICA_ID (passed to the build as VITE_GA4_MEASUREMENT_ID /
 * VITE_YANDEX_METRICA_ID, see .github/workflows/deploy.yml).
 */

const env = import.meta.env;

export const analytics = {
  /** NOCTERA first-party collector. "" disables first-party analytics. */
  collectorUrl: "https://analytics.noctera.stream/collect",

  /** Analytics only runs on these hostnames (never on localhost, previews or copies of the site). */
  hostnames: ["noctera.stream", "www.noctera.stream"],

  /** A visit ends after this much inactivity (keep in sync with SESSION_TIMEOUT_MINUTES in noctera-analytics). */
  sessionTimeoutMinutes: 30,

  /** Report visible time when the page is hidden or left. */
  trackEngagement: true,
  /** Extra engagement reports every N seconds while the page stays visible. 0 = off (recommended). */
  heartbeatSeconds: 0,

  ga4: {
    /** e.g. "G-ABC123XYZ". Empty = GA4 off. */
    measurementId: (env.VITE_GA4_MEASUREMENT_ID as string | undefined) || "",
  },

  yandexMetrica: {
    /** e.g. "98765432". Empty = Yandex Metrica off. */
    counterId: (env.VITE_YANDEX_METRICA_ID as string | undefined) || "",
    /** Click map (aggregated click positions). */
    clickmap: true,
    /**
     * Webvisor = session recording. OFF by default; read "Yandex Webvisor" in the
     * noctera-analytics privacy documentation before enabling it.
     */
    webvisor: false,
  },

  /**
   * Browsers with Global Privacy Control enabled get no third-party analytics (GA4, Yandex).
   * First-party analytics still runs: it is pseudonymous and shares nothing with third parties.
   */
  respectGlobalPrivacyControl: true,
} as const;

/** Fails the build on malformed IDs, so nothing unexpected can end up in a script URL or the CSP. */
export function validateAnalyticsConfig() {
  const { collectorUrl, ga4, yandexMetrica } = analytics;
  if (collectorUrl && !/^https:\/\/[a-z0-9.-]+(:\d+)?\/[A-Za-z0-9/_-]*$/.test(collectorUrl)) {
    throw new Error(`analytics.collectorUrl must be an https URL, got "${collectorUrl}"`);
  }
  if (ga4.measurementId && !/^G-[A-Z0-9]{4,20}$/.test(ga4.measurementId)) {
    throw new Error(`GA4 Measurement ID must look like "G-XXXXXXX", got "${ga4.measurementId}"`);
  }
  if (yandexMetrica.counterId && !/^\d{4,12}$/.test(yandexMetrica.counterId)) {
    throw new Error(`Yandex Metrica counter ID must be digits only, got "${yandexMetrica.counterId}"`);
  }
}

export const analyticsEnabled = () =>
  Boolean(analytics.collectorUrl || analytics.ga4.measurementId || analytics.yandexMetrica.counterId);

/** Extra Content-Security-Policy sources needed by the enabled providers (used by scripts/prerender.mjs). */
export function analyticsCsp(): Record<"script-src" | "connect-src" | "img-src" | "frame-src", string[]> {
  const csp = { "script-src": [] as string[], "connect-src": [] as string[], "img-src": [] as string[], "frame-src": [] as string[] };
  if (analytics.collectorUrl) csp["connect-src"].push(new URL(analytics.collectorUrl).origin);
  if (analytics.ga4.measurementId) {
    csp["script-src"].push("https://*.googletagmanager.com");
    csp["connect-src"].push("https://*.google-analytics.com", "https://*.analytics.google.com", "https://*.googletagmanager.com");
    csp["img-src"].push("https://*.google-analytics.com", "https://*.googletagmanager.com");
  }
  if (analytics.yandexMetrica.counterId) {
    const yandex = ["https://mc.yandex.ru", "https://mc.yandex.com", "https://mc.yandex.com.tr"];
    csp["script-src"].push("https://mc.yandex.ru", "https://yastatic.net");
    csp["connect-src"].push(...yandex);
    csp["img-src"].push(...yandex);
    // Click map and Webvisor render their overlays in frames.
    if (analytics.yandexMetrica.clickmap || analytics.yandexMetrica.webvisor) csp["frame-src"].push("blob:", ...yandex);
  }
  return csp;
}
