// func/productGrid.js
// Controla a renderização, filtro, busca e eventos da grade de produtos.

import { products } from "./data.js";
import { renderProducts, showProductModal, addToWishlist } from "./renderer.js";
import { addToCart } from "./state.js";
import { getElement, getElements } from "./domUtils.js";
import { filterProducts } from "./filter.js";

export function initProductGrid() {
  // Abas (tabs)
  const tabButtons = getElements(".product_grid .tab-btn");
  if (tabButtons.length > 0) {
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

  // Ordenação
  const sortSelect = getElement(".product_grid select");
  if (sortSelect) {
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
        default:
          sortedProducts.sort((a, b) => b.reviews - a.reviews);
      }

      renderProducts(sortedProducts);
    });
  }

  // Render inicial
  updateProductGrid();
}

/*
 * Aplica o filtro global e renderiza os produtos atualizados.
 */
export function updateProductGrid() {
  const productsContainer = document.querySelector(".products-container");
  if (!productsContainer) return;

  const filtered = filterProducts();
  renderProducts(filtered, productsContainer);

  // 🔹 Reanexa eventos nos novos botões
  attachProductEventListeners();
}

/*
 * Liga eventos dos botões de produto após renderização.
 */
export function attachProductEventListeners() {
  // Quick view
  getElements(".quick-view").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      showProductModal(productId);
    });
  });

  // Add to cart
  getElements(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      addToCart(productId);
    });
  });

  // Add to wishlist
  getElements(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      addToWishlist(productId);
    });
  });
}
