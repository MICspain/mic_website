// ============================================
// CARGA DE CONTENIDO EMBEBIDO BAJO CONSENTIMIENTO
// (patrón "click-to-load" / doble clic)
//
// Los iframes de terceros no se cargan hasta que la
// persona usuaria lo pide expresamente, de modo que no
// se almacena nada en su dispositivo sin consentimiento
// (art. 22.2 LSSI-CE). La decisión se recuerda en
// localStorage para no repetir el paso en cada visita.
// ============================================

(function () {
  'use strict';

  var STORAGE_KEY = 'mic_embed_consent';

  function loadStoredConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function rememberConsent(provider) {
    try {
      var stored = loadStoredConsent();
      stored[provider] = true;
      stored.timestamp = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (e) { /* almacenamiento no disponible: se carga solo esta vez */ }
  }

  // Sustituye el marcador por el iframe real.
  function loadEmbed(placeholder) {
    var frame = document.createElement('iframe');
    frame.src = placeholder.dataset.embedSrc;
    frame.title = placeholder.dataset.embedTitle || 'Contenido embebido';
    frame.loading = 'lazy';
    frame.className = 'embed-frame';
    frame.setAttribute('allowfullscreen', 'allowfullscreen');
    frame.setAttribute('allow', 'fullscreen');

    placeholder.replaceChildren(frame);
    placeholder.classList.add('is-loaded');
  }

  document.querySelectorAll('.embed-consent').forEach(function (placeholder) {
    var provider = placeholder.dataset.embedProvider || 'generic';

    // Ya aceptado en una visita anterior: se carga directamente.
    if (loadStoredConsent()[provider]) {
      loadEmbed(placeholder);
      return;
    }

    var button = placeholder.querySelector('.embed-consent-btn');
    if (!button) return;

    button.addEventListener('click', function () {
      rememberConsent(provider);
      loadEmbed(placeholder);
    });
  });
})();
