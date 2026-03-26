// ============================================
// COOKIE CONSENT BANNER
// GDPR / LOPDGDD compliant
// ============================================

(function() {
  'use strict';

  // Check if consent was already given
  const consent = localStorage.getItem('mic_cookie_consent');
  if (consent) return; // Don't show banner if already decided

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
      <p>Usamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y personalizar contenido. Puedes aceptar todas, rechazar las no esenciales o configurar tus preferencias. Más información en nuestra <a href="privacidad.html">Política de Privacidad</a>.</p>
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
        <div class="cookie-toggle-row">
          <span class="cookie-toggle-label">Marketing</span>
          <label class="toggle-switch">
            <input type="checkbox" id="cookie-marketing">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
    <div class="cookie-buttons">
      <button class="cookie-btn cookie-btn-decline" id="cookie-decline">Rechazar</button>
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

  // Accept all
  document.getElementById('cookie-accept').addEventListener('click', () => {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('mic_cookie_consent', JSON.stringify(preferences));
    closeBanner();
  });

  // Decline (only necessary)
  document.getElementById('cookie-decline').addEventListener('click', () => {
    const preferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('mic_cookie_consent', JSON.stringify(preferences));
    closeBanner();
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
