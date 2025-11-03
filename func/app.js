// func/app.js
// The main application controller. Initializes everything in the correct order.

import { loadFragments } from './services.js';
import { initProductGrid, initSearchBar, attachProductEventListeners } from './productGrid.js';
import { initMobileMenu, initSlider } from './components.js';
import { renderProducts } from './renderer.js';
import { updateCartCount } from './state.js';
import { FRAGS } from './config.js';
import { id } from './domUtils.js';

async function init() {
  try {
    // 1. Load all HTML fragments first
    await loadFragments();
    await Promise.resolve(); // Allows the DOM to parse the newly injected HTML

    // 2. Initialize all components
    initProductGrid();
    initSearchBar();
    initMobileMenu();
    initSlider();
    updateCartCount(); // Initial cart count display

    // 3. Attach event listeners to dynamically created elements
    // This needs to run after products are rendered.
    attachProductEventListeners();
    
    // Re-attach listeners whenever products are re-rendered
    const originalRenderProducts = renderProducts;
    renderProducts = function(...args) {
      originalRenderProducts.apply(this, args);
      attachProductEventListeners();
    };

    console.log("✅ Loja inicializada!");
  } catch (e) {
    console.error("Erro na inicialização:", e);
  }
}

// Start the app when the DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Helpful local-file hint from original script
setTimeout(() => {
  const empty = FRAGS.every((n) => {
    const el = id(n);
    return el && el.innerHTML.trim().length === 0;
  });
  if (empty) {
    console.warn(
      "Fragments empty — if you opened index.html via file:// the browser may block fetch. Run a local server (e.g. python -m http.server)."
    );
    const note = document.createElement("div");
    note.textContent = "Fragments failed to load — see console";
    Object.assign(note.style, {
      position: "fixed",
      left: 8,
      bottom: 8,
      padding: "8px 12px",
      background: "rgba(0,0,0,.75)",
      color: "#fff",
      zIndex: 9999,
      borderRadius: "6px",
      fontSize: "13px",
    });
    document.body.appendChild(note);
  }
}, 900);