// ============================================
// GOOGLE ANALYTICS 4 + Google Consent Mode v2
// GA4 loads on every page, but analytics/ad storage
// stays DENIED until the user grants consent via the
// cookie banner (js/cookie.js). GDPR / LOPDGDD aligned.
// ============================================

(function () {
  'use strict';

  var GA_ID = 'G-72L4E9P68P';

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  // 1) Default consent: everything denied until the user decides.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  // 2) Re-apply any decision the user already made on a previous visit.
  try {
    var saved = JSON.parse(localStorage.getItem('mic_cookie_consent'));
    if (saved) {
      gtag('consent', 'update', {
        analytics_storage: saved.analytics ? 'granted' : 'denied',
        ad_storage: saved.marketing ? 'granted' : 'denied',
        ad_user_data: saved.marketing ? 'granted' : 'denied',
        ad_personalization: saved.marketing ? 'granted' : 'denied'
      });
    }
  } catch (e) { /* ignore malformed storage */ }

  // 3) Load the GA library.
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  gtag('js', new Date());
  gtag('config', GA_ID);

  // 4) Called by the cookie banner whenever the user changes preferences.
  window.micApplyConsent = function (prefs) {
    gtag('consent', 'update', {
      analytics_storage: prefs.analytics ? 'granted' : 'denied',
      ad_storage: prefs.marketing ? 'granted' : 'denied',
      ad_user_data: prefs.marketing ? 'granted' : 'denied',
      ad_personalization: prefs.marketing ? 'granted' : 'denied'
    });
  };
})();
