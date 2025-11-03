// func/renderer.js
// Functions responsible for rendering HTML to the page.

import { products } from './data.js';
import { addToCart } from './state.js';

/*
 * Generates HTML for star ratings.
 * @param {number} rating - The product rating.
 * @returns {string} The HTML string for the stars.
 */
export function generateStars(rating) {
  let starsHTML = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }

  return starsHTML;
}

/*
 * Renders a list of products to the product grid container.
 * @param {Array|string} source - The array of products to render, or a filter string.
 */
export function renderProducts(source = "all") {
  const productGrid = document.querySelector(
    ".product_grid .products-container"
  );
  if (!productGrid) {
    console.error("Product grid container not found");
    return;
  }

  productGrid.innerHTML = "";

  const list = Array.isArray(source)
    ? source
    : source === "all"
    ? products
    : products.filter((p) => p.tab === source);

  if (list.length === 0) {
    productGrid.innerHTML = `<p class="no-results">Nenhum produto encontrado.</p>`;
    return;
  }

  list.forEach((product) => {
    const productCard = document.createElement("article");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
        ${
          product.badge
            ? `<span class="product-badge">${product.badge}</span>`
            : ""
        }
        <div class="product-actions">
          <button class="action-btn quick-view" data-id="${product.id}">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn add-to-wishlist" data-id="${product.id}">
            <i class="far fa-heart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h4 class="product-name">${product.name}</h4>
        <div class="product-rating">
          <div class="stars">
            ${generateStars(product.rating)}
          </div>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">$${product.price}</span>
          ${
            product.oldPrice
              ? `<span class="price-old">$${product.oldPrice}</span>`
              : ""
          }
        </div>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(productCard);
  });
}

/**
 * Shows a modal with product details.
 * @param {number} productId - The ID of the product to show.
 */
export function showProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let modal = document.getElementById("product-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "product-modal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <div class="modal-product">
          <div class="modal-image">
            <img id="modal-product-image" src="" alt="">
          </div>
          <div class="modal-info">
            <h2 id="modal-product-name"></h2>
            <div id="modal-product-price" class="modal-price"></div>
            <div class="modal-actions">
              <button id="add-to-cart-modal" class="btn-primary">Add to Cart</button>
              <button id="add-to-wishlist-modal" class="btn-secondary">Add to Wishlist</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".close").addEventListener("click", function () {
      modal.classList.remove("active");
    });

    window.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });
  }

  document.getElementById("modal-product-name").textContent = product.name;
  document.getElementById(
    "modal-product-price"
  ).textContent = `$${product.price}`;
  document.getElementById("modal-product-image").src = product.image;

  // Add event listeners for modal buttons
  document.getElementById('add-to-cart-modal').onclick = () => addToCart(product.id);
  document.getElementById('add-to-wishlist-modal').onclick = () => addToWishlist(product.id);

  modal.classList.add("active");
}

/**
 * Shows a toast notification.
 * @param {string} message - The message to display.
 */
export function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/**
 * Adds a product to the wishlist (placeholder).
 * @param {number} productId - The ID of the product to add.
 */
export function addToWishlist(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  showToast(`${product.name} added to wishlist!`);
}