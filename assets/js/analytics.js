(() => {
  'use strict';

  const config = window.ACADEMIC_SITE_ANALYTICS || {};
  const validCloudflareToken = /^[a-f0-9]{32}$/i.test(config.cloudflareToken || '');
  const validGA4 = /^G-[A-Z0-9]+$/i.test(config.ga4MeasurementId || '');
  const consentKey = 'ming-shi-ga4-consent';

  function loadCloudflare() {
    if (!validCloudflareToken) return;
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.dataset.cfBeacon = JSON.stringify({ token: config.cloudflareToken });
    document.head.appendChild(script);
  }

  function loadGA4() {
    if (!validGA4 || window.__mingShiGA4Loaded) return;
    window.__mingShiGA4Loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', config.ga4MeasurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      transport_type: 'beacon'
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.ga4MeasurementId)}`;
    document.head.appendChild(script);
  }

  function getConsent() {
    try { return localStorage.getItem(consentKey); } catch (_) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(consentKey, value); } catch (_) { /* ignored */ }
  }

  function showConsent() {
    if (document.querySelector('.analytics-consent')) return;
    const panel = document.createElement('aside');
    panel.className = 'analytics-consent';
    panel.setAttribute('aria-label', 'Analytics preference');
    panel.innerHTML = `
      <p>This site can use privacy-conscious analytics to understand aggregate geography, publication downloads, and referral sources. No personally identifying information should be submitted.</p>
      <div class="button-row">
        <button class="button button-primary" type="button" data-analytics-accept>Allow analytics</button>
        <button class="button button-secondary" type="button" data-analytics-decline>No thanks</button>
        <a class="button button-quiet" href="privacy.html">Details</a>
      </div>`;
    document.body.appendChild(panel);
    panel.querySelector('[data-analytics-accept]').addEventListener('click', () => {
      setConsent('granted');
      panel.remove();
      loadGA4();
    });
    panel.querySelector('[data-analytics-decline]').addEventListener('click', () => {
      setConsent('denied');
      panel.remove();
    });
  }

  loadCloudflare();

  if (validGA4) {
    if (config.requireGoogleConsent === false) {
      loadGA4();
    } else {
      const consent = getConsent();
      if (consent === 'granted') loadGA4();
      else if (consent !== 'denied') {
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showConsent, { once: true });
        else showConsent();
      }
    }
  }

  window.trackAcademicEvent = (eventName, parameters = {}) => {
    if (!eventName || typeof window.gtag !== 'function') return;
    const safeName = String(eventName).toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 40);
    window.gtag('event', safeName, parameters);
  };
})();
