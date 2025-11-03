// func/state.js
// Manages the global application state, such as the shopping cart.

import { products } from './data.js';
import { showToast } from './renderer.js';

export const state = {
  cart: [],
  cartCount: 0,
};

/*
 * Adds a product to the shopping cart.
 * @param {number} productId - The ID of the product to add.
 */
export function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({
      ...product,
      quantity: 1,
    });
  }

  updateCartCount();
  showToast(`${product.name} added to cart!`);
}

/*
 * Updates the cart count display in the UI.
 */
export function updateCartCount() {
  state.cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) cartCountElement.textContent = state.cartCount;
}