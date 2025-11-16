// func/state.js
// Gerencia o estado global da aplicação (carrinho, busca, categoria, etc.)

import { products } from "./data.js";
import { showToast } from "./renderer.js";

export const state = {
  cart: [],
  cartCount: 0,
  search: "", // texto da busca
  category: "all", // categoria selecionada
  tab: "all", // aba ativa (ex: sale, new, best)
};

/**
 * Adiciona um produto ao carrinho
 * @param {number} productId - ID do produto
 */
export function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  updateCartCount();
  showToast(`${product.name} adicionado ao carrinho!`);
}

/**
 * Atualiza a contagem do carrinho no cabeçalho
 */
export function updateCartCount() {
  state.cartCount = state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = state.cartCount;

    cartCountElement.classList.add("bump");
    setTimeout(() => cartCountElement.classList.remove("bump"), 300);
  }
}
