// func/productGrid.js
// Handles all logic specific to the product grid: filtering, sorting, searching, and event listeners.

import { products } from './data.js';
import { renderProducts, showProductModal, addToWishlist } from './renderer.js';
import { addToCart } from './state.js';
import { getElement, getElements } from './domUtils.js';

export function initProductGrid() {
  // Tab functionality
  const tabButtons = getElements(".product_grid .tab-btn");
  if (tabButtons.length > 0) {
    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        renderProducts(this.getAttribute("data-tab"));
      });
    });
  }

  // Sort functionality
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
        default: // Mais populares
          sortedProducts.sort((a, b) => b.reviews - a.reviews);
      }

      const activeTab = getElement(".product_grid .tab-btn.active");
      const filter = activeTab ? activeTab.getAttribute("data-tab") : "all";

      renderProducts(filter ? sortedProducts.filter(p => p.tab === filter) : sortedProducts);
    });
  }

  // Initial render
  renderProducts();
}

export function initSearchBar() {
  const searchDesktop = getElement("#search-desktop");
  if (!searchDesktop) {
    console.warn("Campo de busca não encontrado!");
    return;
  }

  searchDesktop.addEventListener("input", function () {
    const searchText = this.value.toLowerCase().trim();

    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchText) ||
        p.category.toLowerCase().includes(searchText)
    );
    renderProducts(searchText ? filtered : "all");
  });
}

/*
 * Attaches event listeners to product buttons after they are rendered.
 */
export function attachProductEventListeners() {
  // Quick view buttons
  getElements(".quick-view").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      showProductModal(productId);
    });
  });

  // Add to cart buttons
  getElements(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      addToCart(productId);
    });
  });

  // Add to wishlist buttons
  getElements(".add-to-wishlist").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = parseInt(this.getAttribute("data-id"));
      addToWishlist(productId);
    });
  });
}