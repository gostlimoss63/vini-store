// func/renderer.js
// Responsável por renderizar o HTML da loja (produtos, modal e notificações)

import { products } from "./data.js";
import {
  addToCart,
  removeFromCart,
  toggleWishlist,
  isFavorite,
  state,
} from "./state.js";

/**
 * Gera HTML de estrelas baseado na nota do produto
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

/**
 * Renderiza a lista de produtos no container indicado
 */
// ...existing code...
export function renderProducts(source = "all", container = null) {
  const productGrid =
    container || document.querySelector(".product_grid .products-container");

  if (!productGrid) {
    console.error("Product grid container not found");
    return;
  }

  productGrid.innerHTML = "";

  // Build initial list based on `source`
  let list;
  if (Array.isArray(source)) {
    list = source;
  } else if (source === "all") {
    list = products;
  } else {
    // source is a tab name (e.g. "sale", "new", "best")
    list = products.filter((p) => p.tab === source);
  }

  // Apply favorites-only filter if active in global state
  if (state.isFavoritesOnly) {
    list = list.filter((p) => state.wishlist.includes(p.id));
  }

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
            <i class="${isFavorite(product.id) ? "fas" : "far"} fa-heart"></i>
          </button>
        </div>
      </div>

      <div class="product-info">
        <div class="product-category">${product.category}</div>

        <h4 class="product-name">${product.name}</h4>

        <div class="product-rating">
          <div class="stars">${generateStars(product.rating)}</div>
          <span class="rating-count">(${product.reviews})</span>
        </div>

        <div class="product-price">
          <span class="price-current">R$${product.price}</span>
          ${
            product.oldPrice
              ? `<span class="price-old">R$${product.oldPrice}</span>`
              : ""
          }
        </div>

        <button class="add-to-cart" data-id="${product.id}">
          Add to Cart
        </button>
      </div>
    `;

    productGrid.appendChild(productCard);
  });
}
// ...existing code...

/**
 * Mostra o modal de detalhes do produto
 */
export function showProductModal(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  let modal = document.getElementById("product-modal");

  // Criar modal se não existe
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
              <button id="add-to-cart-modal" class="btn-primary">
                Add to Cart
              </button>

              <button id="add-to-wishlist-modal" class="btn-secondary">
                <i id="wishlist-icon-modal" class="far fa-heart"></i>
                Favoritar
              </button>

              <button id="remove-to-cart" class="btn-remove">
                Remove to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".close").addEventListener("click", () => {
      modal.classList.remove("active");
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }

  // Atualizar conteúdo do modal
  document.getElementById("modal-product-name").textContent = product.name;
  document.getElementById(
    "modal-product-price"
  ).textContent = `R$${product.price}`;
  document.getElementById("modal-product-image").src = product.image;

  // Adicionar ao carrinho
  document.getElementById("add-to-cart-modal").onclick = () =>
    addToCart(product.id);

  // Remover do carrinho
  document.getElementById("remove-to-cart").onclick = () =>
    removeFromCart(product.id);

  document.getElementById("track-order")?.addEventListener("click", () => {
    showToast("Pedido rastreado com sucesso!");
  });

  document.getElementById("favorite-btn")?.addEventListener("click", () => {
    const isFavorite = products.filter((p) => wishlist.includes(p.id));

    renderProducts();

    // reaplica eventos para quick view, add-to-cart etc.
    attachProductEventListeners();
  });

  // Wishlist
  const wishlistIcon = document.getElementById("wishlist-icon-modal");
  wishlistIcon.className = isFavorite(product.id)
    ? "fas fa-heart"
    : "far fa-heart";

  document.getElementById("add-to-wishlist-modal").onclick = () => {
    toggleWishlist(product.id);
    wishlistIcon.className = isFavorite(product.id)
      ? "fas fa-heart"
      : "far fa-heart";
    renderProducts("all");
    import("./productGrid.js").then(({ attachProductEventListeners }) => {
      attachProductEventListeners();
    });
  };

  modal.classList.add("active");
}

/**
 * Toast de notificação
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

  setTimeout(() => toast.classList.remove("show"), 3000);
}

export function initializeProductGrid() {
  document.addEventListener("DOMContentLoaded", () => {
    const productsContainer = document.querySelector(".products-container");
    if (productsContainer) {
      renderProducts("all", productsContainer);

      // Anexa eventos após renderizar
      import("./productGrid.js").then(({ attachProductEventListeners }) => {
        attachProductEventListeners();
      });
    }
  });
}

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
