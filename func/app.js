// func/app.js
// Controla a inicialização geral da aplicação.

import { loadFragments } from "./services.js";
import {
  initProductGrid,
  attachProductEventListeners,
  updateProductGrid,
} from "./productGrid.js";
import { initMobileMenu, initSlider } from "./components.js";
import { renderProducts, showToast } from "./renderer.js";
import { updateCartCount, state, clearCart, toggleWishlist } from "./state.js";
import { FRAGS } from "./config.js";
import { id } from "./domUtils.js";
import { products } from "./data.js";

// Normalização de categorias
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
  botas: "botas",
  tenis: "tênis",
  sapatos: "sapatos",
  mocassins: "mocassins",
  camisetas: "casual",
  camisas: "social",
  mochilas: "mochilas",
};

const USER_KEY = "vintcy-user";

// Busca + categorias
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
      const selected = (btn.dataset.categoria || "").toLowerCase().trim();
      const mapped = CATEGORY_MAP[selected] || selected;

      const isActive = btn.classList.contains("active");

      categoryButtons.forEach((b) => b.classList.remove("active"));

      if (isActive) {
        state.category = "all";
        renderProducts(products);
      } else {
        btn.classList.add("active");
        state.category = mapped;

        const filtered = products.filter(
          (p) => p.category.toLowerCase() === mapped
        );

        renderProducts(filtered);
      }

      attachProductEventListeners();
    });
  });
}

// Filtro categoria via dropdown
export function initCategoryFilters() {
  document.querySelectorAll("[data-category]").forEach((item) => {
    item.addEventListener("click", () => {
      const cat = item.dataset.category;
      state.category = cat;

      const filtered =
        cat === "all"
          ? products
          : products.filter(
              (p) => p.category.toLowerCase() === cat.toLowerCase()
            );

      renderProducts(filtered);
      attachProductEventListeners();
    });
  });
}

// ...existing code...

// ...existing code...

// Helpers para salvar/ler usuário (localStorage)
function saveUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Erro ao salvar usuário:", e);
  }
}

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

// Inicializador do modal de conta (registro / login)
function initAccountModal() {
  const accountBtn = document.getElementById("account-btn");
  const modal = document.getElementById("account-modal");
  const closeBtn = document.querySelector(".close-account");
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  // NÃO auto-logar / NÃO atualizar o botão ao cadastrar.
  // Ou seja: apenas salvar o usuário no localStorage no registro.
  // O botão "Olá, ..." só será atualizado depois do login bem-sucedido.

  accountBtn?.addEventListener("click", () => {
    modal?.classList.remove("hidden");
  });

  closeBtn?.addEventListener("click", () => {
    modal?.classList.add("hidden");
  });

  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();

    if (!name || !email || !password) {
      return showToast("Preencha todos os campos.");
    }

    saveUser({ name, email, password });

    showToast("Cadastro efetuado com sucesso!");
    modal?.classList.add("hidden");
    // NÃO alterar accountBtn aqui — só após login
  });

  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const savedUser = getSavedUser();
    if (!savedUser) {
      return showToast("Nenhuma conta cadastrada!");
    }

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (email === savedUser.email && password === savedUser.password) {
      showToast("Login realizado com sucesso!");
      if (accountBtn) accountBtn.innerHTML = `Olá, ${savedUser.name}`;
      modal?.classList.add("hidden");
    } else {
      showToast("Email ou senha incorretos.");
    }
  });
}

// ...existing code...

// ...existing code...

export function initFavoriteFilter() {
  const btn = document.getElementById("favorite-btn");
  if (!btn) {
    console.warn("Botão de favoritos não encontrado no DOM!");
    return;
  }

  btn.addEventListener("click", () => {
    state.isFavoritesOnly = !state.isFavoritesOnly;
    renderProducts();
  });
}

// Limpar carrinho
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("clear-cart");
  if (btn) btn.addEventListener("click", clearCart);
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("track-order");
  if (track) {
    track.addEventListener("click", () => {
      showToast("Pedido rastreado com sucesso!");
    });
  }
});

document.addEventListener("click", function (e) {
  if (e.target.closest("#contact-btn")) {
    const footer = document.querySelector("footer");
    if (footer) footer.scrollIntoView({ behavior: "smooth" });
  }
});

// Abrir modal
document.getElementById("account-btn")?.addEventListener("click", () => {
  document.getElementById("account-modal").classList.remove("hidden");
});

// Fechar modal
document.querySelector(".close-account")?.addEventListener("click", () => {
  document.getElementById("account-modal").classList.add("hidden");
});

// Registrar usuário
document.getElementById("register-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  const newUser = { name, email, password };

  saveUser(newUser);

  showToast("Conta criada com sucesso!");

  document.getElementById("account-btn").innerHTML = `Olá, ${name}`;
  document.getElementById("account-modal").classList.add("hidden");
});

// Login simples
document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const saved = JSON.parse(localStorage.getItem("vintcy-user"));
  if (!saved) return showToast("Nenhuma conta cadastrada!");

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (email === saved.email && password === saved.password) {
    showToast("Login realizado!");
    document.getElementById("account-btn").innerHTML = `Olá, ${saved.name}`;
    document.getElementById("account-modal").classList.add("hidden");
  } else {
    showToast("Email ou senha incorretos.");
  }
});

// Inicialização principal
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
      initCategoryFilters();
      initFavoriteFilter();
      initAccountModal();

      // Reanexa eventos após qualquer re-render
      const originalRender = renderProducts;
      window.renderProducts = (...args) => {
        originalRender(...args);
        attachProductEventListeners();
      };

      console.log("✅ Loja inicializada com sucesso!");
    }, 300);
  } catch (e) {
    console.error("Erro ao inicializar:", e);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Erro caso fragments não carreguem
setTimeout(() => {
  const empty = FRAGS.every((n) => {
    const el = id(n);
    return el && el.innerHTML.trim() === "";
  });

  if (empty) {
    console.warn(
      "Fragments vazios — se abriu via file://, use um servidor local (ex: python -m http.server)"
    );
  }
}, 900);
