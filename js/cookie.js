// ============================================
// COOKIE CONSENT BANNER
// GDPR / LOPDGDD compliant
// ============================================

(function() {
  'use strict';

  // El banner solo se oculta si hay una decisión previa VIGENTE
  // (caduca a los 24 meses; ver js/analytics.js). Si el ayudante no
  // estuviera disponible, se pregunta de nuevo por precaución.
  const consent = typeof window.micGetStoredConsent === 'function'
    ? window.micGetStoredConsent()
    : null;
  if (consent) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'cookie-overlay';

  // Create banner
  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Consentimiento de cookies');
  banner.innerHTML = `
    <div class="cookie-header">
      <span class="cookie-icon">🍪</span>
      <h3>Utilizamos cookies</h3>
    </div>
    <div class="cookie-body">
      <p>Usamos cookies necesarias para el funcionamiento del sitio y cookies analíticas para entender cómo se utiliza y mejorarlo. No usamos cookies publicitarias. Puedes aceptarlas, rechazarlas o cambiar de opinión cuando quieras. Más información en nuestra <a href="cookies.html">Política de Cookies</a> y en nuestra <a href="privacidad.html">Política de Privacidad</a>.</p>
      <div class="cookie-toggles">
        <div class="cookie-toggle-row">
          <span class="cookie-toggle-label">Necesarias <span>(siempre activas)</span></span>
          <label class="toggle-switch">
            <input type="checkbox" checked disabled>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="cookie-toggle-row">
          <span class="cookie-toggle-label">Analíticas</span>
          <label class="toggle-switch">
            <input type="checkbox" id="cookie-analytics">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
    <div class="cookie-buttons">
      <button class="cookie-btn cookie-btn-decline" id="cookie-decline">Rechazar</button>
      <button class="cookie-btn cookie-btn-save" id="cookie-save">Guardar preferencias</button>
      <button class="cookie-btn cookie-btn-accept" id="cookie-accept">Aceptar todas</button>
    </div>
  `;

  // Append to body
  document.body.appendChild(overlay);
  document.body.appendChild(banner);

  // Show banner after a short delay
  setTimeout(() => {
    overlay.classList.add('active');
    banner.classList.add('active');
  }, 800);

  // Persist a decision and push it to Google Consent Mode (analytics.js).
  function savePreferences(preferences) {
    preferences.necessary = true;
    preferences.timestamp = new Date().toISOString();
    localStorage.setItem('mic_cookie_consent', JSON.stringify(preferences));
    if (typeof window.micApplyConsent === 'function') {
      window.micApplyConsent(preferences);
    }
    closeBanner();
  }

  // Accept all
  document.getElementById('cookie-accept').addEventListener('click', () => {
    savePreferences({ analytics: true });
  });

  // Decline (only necessary)
  document.getElementById('cookie-decline').addEventListener('click', () => {
    savePreferences({ analytics: false });
  });

  // Save the exact toggle selection
  document.getElementById('cookie-save').addEventListener('click', () => {
    savePreferences({
      analytics: document.getElementById('cookie-analytics').checked
    });
  });

  function closeBanner() {
    banner.classList.remove('active');
    banner.classList.add('hidden');
    overlay.classList.remove('active');
    setTimeout(() => {
      banner.remove();
      overlay.remove();
    }, 400);
  }

})();
