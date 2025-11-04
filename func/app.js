// func/app.js
// Controla a inicialização geral da aplicação.

import { loadFragments } from "./services.js";
import {initProductGrid,attachProductEventListeners,updateProductGrid,} from "./productGrid.js";
import { initMobileMenu, initSlider } from "./components.js";
import { renderProducts } from "./renderer.js";
import { updateCartCount, state } from "./state.js";
import { FRAGS } from "./config.js";
import { id } from "./domUtils.js";
import { products } from "./data.js";

// ✅ Mapeamento de categorias (caso precise associar nomes diferentes)
const CATEGORY_MAP = {
  casual: "casual",
  polos: "polos",
  social: "social",
  jaquetas: "jaquetas",
  moletons: "moletons",
  calças: "calças",
  calcas: "calças",
  bermudas: "bermudas",
  acessorios: "acessorios",
  accessories: "acessorios",
  fashion: "fashion",
  electronics: "electronics",
  "men's wear": "men's wear",
  "women's wear": "women's wear",
  "home & garden": "home & garden",
};

// ✅ Inicializa busca e categorias
export function initSearchAndCategories() {
  const searchInput = document.getElementById("search-desktop");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.search = e.target.value.toLowerCase().trim();
      updateProductGrid();
    });
  }

  const categoryButtons = document.querySelectorAll(".categoria-btn");
  if (!categoryButtons.length) return;

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selected = btn.dataset.categoria.toLowerCase().trim();
      const mapped = CATEGORY_MAP[selected] || selected;

      // Verifica se botão já está ativo
      const isActive = btn.classList.contains("active");

      // Remove classe "active" de todos
      categoryButtons.forEach((b) => b.classList.remove("active"));

      if (isActive) {
        // 🔹 Se clicou de novo → limpa filtro
        state.category = "all";
        renderProducts(products);
      } else {
        // 🔹 Aplica o filtro e adiciona destaque
        btn.classList.add("active");
        state.category = mapped;
        const filtered = products.filter(
          (p) => p.category.toLowerCase() === state.category
        );
        renderProducts(filtered);
      }

      // 🔄 Atualiza grade e reanexa eventos dos botões (add-to-cart, wishlist, etc)
      attachProductEventListeners();
    });
  });
}

// ✅ Inicialização principal
async function init() {
  try {
    await loadFragments();
    await Promise.resolve();

    setTimeout(() => {
      initProductGrid();
      initMobileMenu();
      initSlider();
      updateCartCount();
      renderProducts(products);
      initSearchAndCategories();
      attachProductEventListeners();

      // 🔄 Reanexa listeners após re-renderizar produtos
      const originalRenderProducts = renderProducts;
      window.renderProducts = function (...args) {
        originalRenderProducts.apply(this, args);
        attachProductEventListeners();
      };

      console.log("✅ Loja inicializada com sucesso!");
    }, 150);
  } catch (e) {
    console.error("Erro na inicialização:", e);
  }
}

// 🚀 Inicia o app quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// ⚠️ Aviso caso fragments falhem no modo file://
setTimeout(() => {
  const empty = FRAGS.every((n) => {
    const el = id(n);
    return el && el.innerHTML.trim().length === 0;
  });
  if (empty) {
    console.warn(
      "Fragments vazios — se abriu via file://, use um servidor local (ex: python -m http.server)"
    );
    const note = document.createElement("div");
    note.textContent = "Fragments failed to load — veja o console.";
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
