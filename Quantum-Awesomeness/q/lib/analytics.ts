import { inject } from '@vercel/analytics';

let injected = false;

export const ANALYTICS_EVENTS = {
  APP_LOADED: 'app_loaded',
  FRAMEWORK_CHANGED: 'framework_changed',
  APP_GENERATED: 'app_generated',
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export function initializeAnalytics() {
  if (typeof window === 'undefined') return;
  if (injected) return;
  try {
    inject();
    injected = true;
  } catch (e) {
    console.warn('Analytics injection failed', e);
  }
}

export function trackEvent(name: AnalyticsEventName, props?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      name,
      props: props || {},
      ts: Date.now(),
    };
    console.debug('[analytics]', payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
    } else {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // swallow
  }
}
