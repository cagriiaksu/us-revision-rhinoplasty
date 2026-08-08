// Lead tracking utilities — UTM, click IDs, behavioral data, device context

// ─── Types ───────────────────────────────────────────────────────────

export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
}

export interface ClickIds {
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  msclkid: string;
}

export interface DeviceContext {
  device: 'mobile' | 'desktop';
  screen: string;
  viewport: string;
  language: string;
  referrer: string;
  landing_page: string;
  user_agent: string;
  timezone: string;
}

export interface BehavioralData {
  time_on_page: number;
  scroll_depth: number;
}

export interface LeadContext extends UtmParams, ClickIds, DeviceContext, BehavioralData {
  lead_id: string;
}

// ─── Module State ────────────────────────────────────────────────────

const PAGE_LOAD_TIME = Date.now();
let maxScrollDepth = 0;
let behavioralTrackingInitialized = false;

// ─── Cookie Helpers (private) ────────────────────────────────────────

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function getCookie(name: string): string {
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'),
  );
  return match ? decodeURIComponent(match[1]) : '';
}

// ─── Exported Functions ──────────────────────────────────────────────

const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'] as const;
const COOKIE_EXPIRY_DAYS = 90;

export function getUtmParams(): UtmParams {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    utm_term: params.get('utm_term') || '',
  };
}

export function getDeviceContext(): DeviceContext {
  return {
    device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    screen: `${screen.width}x${screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language || '',
    referrer: document.referrer || '',
    landing_page: window.location.href,
    user_agent: navigator.userAgent,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  };
}

export function getClickIds(): ClickIds {
  const params = new URLSearchParams(window.location.search);
  const result: ClickIds = { gclid: '', gbraid: '', wbraid: '', fbclid: '', msclkid: '' };

  for (const key of CLICK_ID_KEYS) {
    result[key] = params.get(key) || getCookie(`_lt_${key}`) || '';
  }

  return result;
}

export function persistClickIds(): void {
  const params = new URLSearchParams(window.location.search);

  for (const key of CLICK_ID_KEYS) {
    const value = params.get(key);
    if (value) {
      setCookie(`_lt_${key}`, value, COOKIE_EXPIRY_DAYS);
    }
  }
}

export function initBehavioralTracking(): void {
  if (behavioralTrackingInitialized) return;
  behavioralTrackingInitialized = true;

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight > 0) {
      const percent = Math.round((scrollTop / docHeight) * 100);
      if (percent > maxScrollDepth) {
        maxScrollDepth = percent;
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

export function getBehavioralData(): BehavioralData {
  return {
    time_on_page: Math.round((Date.now() - PAGE_LOAD_TIME) / 1000),
    scroll_depth: maxScrollDepth,
  };
}

export function generateLeadId(): string {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }

  return `LEAD-${date}-${random}`;
}

export function getFullLeadContext(): LeadContext {
  return {
    ...getUtmParams(),
    ...getClickIds(),
    ...getDeviceContext(),
    ...getBehavioralData(),
    lead_id: generateLeadId(),
  };
}
