// func/productGrid.js
// Controla renderização, filtros, busca e eventos de interação da grade de produtos.

import { products } from "./data.js";
import { renderProducts, showProductModal } from "./renderer.js";
import { addToCart, clearCart, removeFromCart } from "./state.js";
import { getElement, getElements } from "./domUtils.js";
import { filterProducts } from "./filter.js";
import { toggleWishlist } from "./state.js";

/*
 * Inicializa a grade de produtos
 */
export function initProductGrid() {
  initTabs();
  initSortSystem();
  updateProductGrid(); // Render inicial
}

/*
 * Inicializa as abas de navegação (tabs)
 */
function initTabs() {
  const tabButtons = getElements(".product_grid .tab-btn");
  if (tabButtons.length === 0) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const selectedTab = this.getAttribute("data-tab");

      import("./state.js").then(({ state }) => {
        state.tab = selectedTab;
      });

      updateProductGrid();
    });
  });
}

/*
 * Ordenação dos produtos
 */
function initSortSystem() {
  const sortSelect = getElement(".product_grid select");
  if (!sortSelect) return;

  sortSelect.addEventListener("change", function () {
    const sortBy = this.value;
    let sortedProducts = [...products];

    switch (sortBy) {
      case "Novidades":
        sortedProducts.sort((a, b) => b.id - a.id);
        break;

      case "Preço: menor":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;

      default: // Mais vendidos / bem avaliados
        sortedProducts.sort((a, b) => b.reviews - a.reviews);
    }

    const productsContainer = document.querySelector(".products-container");
    if (productsContainer) {
      renderProducts(sortedProducts, productsContainer);
      attachProductEventListeners();
    }
  });
}

/*
 * Aplica os filtros globais e renderiza a grade
 */
export function updateProductGrid() {
  const productsContainer = document.querySelector(".products-container");
  if (!productsContainer) return;

  const filtered = filterProducts();
  renderProducts(filtered, productsContainer);

  // Reanexa eventos porque o DOM mudou
  attachProductEventListeners();
}

/*
 * Liga eventos de cada produto (cart, wishlist, modal, etc)
 */
export function attachProductEventListeners() {
  // Quick View
  getElements(".quick-view").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      showProductModal(productId);
    });
  });

  // Add to cart
  getElements(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      addToCart(productId);
    });
  });

  // Remove do carrinho
  getElements(".remove-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      removeFromCart(productId);
    });
  });

  // Limpar carrinho
  getElements(".clear-cart").forEach((button) => {
    button.addEventListener("click", function () {
      clearCart(); // não recebe productId
    });
  });

  // Toggle wishlist
  getElements(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.dataset.id);
      toggleWishlist(productId);
    });
  });

  getElements(".favorite-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const favs = products.filter((p) => wishlist.includes(p.id));
      renderProducts(favs);
      attachProductEventListeners();
    });
  });

  // ...
}
