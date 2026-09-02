// ============================================
// PRESENTACIONES PDF EMBEBIDAS
//
// El visor de PDF integrado del navegador funciona bien en
// pantallas grandes, pero no de forma fiable dentro de un
// iframe en móviles (iOS Safari solo pinta la primera página
// y Android Chrome no lo muestra). Por eso el HTML incluye de
// base una tarjeta con enlace y aquí la sustituimos por el
// visor solo cuando hay espacio suficiente. Así el PDF no se
// descarga en móvil ni sin JavaScript.
// ============================================

(function () {
  'use strict';

  var MIN_WIDTH = 768;

  function buildViewer(container) {
    var frame = document.createElement('iframe');
    // navpanes=0 oculta el panel de miniaturas y view=Fit encaja la
    // diapositiva completa. La barra de herramientas se deja visible
    // a propósito: es la forma de pasar de página en un documento de
    // varias diapositivas. Cada navegador aplica estos parámetros a
    // su manera; Firefox y Safari muestran su propia interfaz.
    frame.src = container.dataset.pdfSrc + '#navpanes=0&view=Fit';
    frame.title = container.dataset.pdfTitle || 'Documento PDF';
    frame.loading = 'lazy';
    frame.className = 'pdf-embed-frame';

    container.replaceChildren(frame);
    container.classList.add('is-viewer');
  }

  document.querySelectorAll('.pdf-embed').forEach(function (container) {
    if (!container.dataset.pdfSrc) return;
    if (window.innerWidth < MIN_WIDTH) return;
    buildViewer(container);
  });
})();
