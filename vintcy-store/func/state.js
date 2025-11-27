// func/state.js

import { products } from "./data.js";
import { showToast } from "./renderer.js";

export const state = {
  cart: [],
  wishlist: [],
  cartCount: 0,
  search: "",
  category: "all",
  tab: "all",
  isFavoritesOnly: false,
};

// -------------------------
// CHAVE DE ARMAZENAMENTO
// -------------------------
const STORAGE_KEY = "vintcy-cart_v1";
const WISHLIST_KEY = "wishlist";

// -------------------------
// CARREGAR WISHLIST (agora antes de usar)
// -------------------------
export function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Erro ao carregar wishlist:", e);
    return [];
  }
}

// Inicializa wishlist corretamente
state.wishlist = loadWishlist();

// -------------------------
// SALVAR WISHLIST
// -------------------------
export function saveWishlist() {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist));
  } catch (e) {
    console.warn("Erro ao salvar wishlist:", e);
  }
}

// -------------------------
// ARMAZENAMENTO DO CARRINHO
// -------------------------
function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
  } catch (e) {
    console.warn("Storage save failed:", e);
  }
}

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.cart = raw ? JSON.parse(raw) : [];
  } catch (e) {
    state.cart = [];
  }
}

// -------------------------
// ADICIONAR AO CARRINHO
// -------------------------
export function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = state.cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCount();
  showToast(`${product.name} adicionado ao carrinho!`);
}

// -------------------------
// ATUALIZAR CONTAGEM DO CARRINHO
// -------------------------
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

// -------------------------
// REMOVER DO CARRINHO
// -------------------------
export function removeFromCart(productId, qty = 1, qtyAll = false) {
  const product = products.find((p) => String(p.id) === String(productId));
  if (!product) return;

  const existingItem = state.cart.find(
    (item) => String(item.id) === String(productId)
  );

  if (!existingItem) {
    showToast("Este produto não está no carrinho.");
    return;
  }

  if (qtyAll) {
    state.cart = state.cart.filter(
      (item) => String(item.id) !== String(productId)
    );
  } else {
    existingItem.quantity = Math.max(0, existingItem.quantity - qty);
    if (existingItem.quantity <= 0) {
      state.cart = state.cart.filter(
        (item) => String(item.id) !== String(productId)
      );
    }
  }

  saveCart();
  updateCartCount();
  showToast(`${product.name} removido do carrinho!`);
}

// -------------------------
// LIMPAR CARRINHO
// -------------------------
export function clearCart() {
  state.cart = [];
  saveCart();
  updateCartCount();
  showToast("Carrinho Limpo!");
}

// -------------------------
// INICIALIZAR
// -------------------------
export function initCartFromStorage() {
  loadCart();
  updateCartCount();
}

// -------------------------
// FAVORITOS
// -------------------------
export function toggleWishlist(productId) {
  const exists = state.wishlist.includes(productId);

  if (exists) {
    state.wishlist = state.wishlist.filter((id) => id !== productId);
  } else {
    state.wishlist.push(productId);
  }
  state.isFavoritesOnly = state.wishlist.length > 0;

  saveWishlist();
}

export function isFavorite(productId) {
  return state.wishlist.includes(productId);
}
