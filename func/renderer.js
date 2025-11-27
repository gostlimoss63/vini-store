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
export function renderProducts(source = "all", container = null) {
  const productGrid =
    container || document.querySelector(".product_grid .products-container");

  if (!productGrid) {
    console.error("Product grid container not found");
    return;
  }

  productGrid.innerHTML = "";

  // Constrói a lista inicial com base em `source`
  let list;
  if (Array.isArray(source)) {
    list = source;
  } else if (source === "all") {
    list = products;
  } else {
    // source is a tab name (e.g. "sale", "new", "best")
    list = products.filter((p) => p.tab === source);
  }

  // Aplica filtros somente se estiver no modo favoritos
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
          <button class="action-btn quick-view" data-id="${
            product.id
          }" title="Visualizar">
            <i class="fas fa-eye"></i>
          </button>

          <button class="action-btn add-to-wishlist" data-id="${
            product.id
          }" title="Favoritar">
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
          Adicionar ao Carrinho
        </button>
      </div>
    `;

    // Clique no card (abre a página de detalhe)
    productCard.addEventListener("click", (e) => {
      // não redirecionar se o clique for em botões/links (quick-view, wishlist, add-to-cart, etc.)
      if (
        e.target.closest(".action-btn") ||
        e.target.closest("button") ||
        e.target.closest("a")
      ) {
        return;
      }

      const slug =
        product.slug ||
        String(product.name)
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "") // remove acentos
          .replace(/[^\w-]/g, "");

      // passa id, slug, nome e categoria para a página de detalhe
      const url = `../Projeto faculdade/index.html?id=${
        product.id
      }&product=${encodeURIComponent(slug)}&name=${encodeURIComponent(
        product.name
      )}&category=${encodeURIComponent(product.category || "")}`;

      window.location.href = url;
    });

    productGrid.appendChild(productCard);
  });
}

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

    // NOTE: incluí aqui um bloco .size-section para garantir que o modal
    // sempre terá o container de tamanhos esperado pela lógica.
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close" title="Fechar">&times;</span>

        <div class="modal-product">
          <div class="modal-image">
            <img id="modal-product-image" src="" alt="">
          </div>

          <div class="modal-info">
            <h2 id="modal-product-name"></h2>
            <div id="modal-product-price" class="modal-price"></div>

            <!-- seção de tamanhos garantida -->
            <div class="size-section" style="margin-top:12px;">
              <label class="option-label">Tamanho</label>
              <div class="size-pills" role="group" aria-label="Selecionar tamanho"></div>
            </div>

            <div class="modal-actions" style="margin-top:16px;">
              <button id="add-to-cart-modal" class="btn-primary">
                Adicionar ao Carrinho
              </button>

              <button id="add-to-wishlist-modal" class="btn-secondary">
                <i id="wishlist-icon-modal" class="far fa-heart"></i>
                Favoritar
              </button>

              <button id="remove-to-cart" class="btn-remove">
                Remover do Carrinho
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

  // Atualizar wishlist icon
  const wishlistIcon = document.getElementById("wishlist-icon-modal");
  if (wishlistIcon) {
    wishlistIcon.className = isFavorite(product.id)
      ? "fas fa-heart"
      : "far fa-heart";
  }

  modal.classList.add("active");

  // ------- LÓGICA DE TAMANHOS -------
  const sizeSection = modal.querySelector(".size-section");
  const sizeContainer = modal.querySelector(".size-pills");
  const sizeLabel = modal.querySelector(".option-label");

  // Variável local para armazenar o tamanho selecionado
  let selectedSize = null;

  if (sizeSection && sizeContainer && sizeLabel) {
    // Reset
    sizeContainer.innerHTML = "";
    sizeContainer.style.display = "flex";
    sizeLabel.style.display = "block";
    sizeSection.style.display = "block";

    let sizes = [];

    // Calçados → numeração
    if (product.category === "Calçados") {
      sizes = ["38", "39", "40", "41", "42", "43", "44"];
    }
    // Acessórios → esconder tudo (não mostrar bloco)
    else if (product.category === "Acessórios") {
      sizeSection.style.display = "none";
    }
    // Outros → tamanhos normais
    else {
      sizes = ["P", "M", "G", "GG", "XG"];
    }

    // Criar botões dinamicamente (se houver tamanhos)
    if (sizes.length > 0) {
      sizes.forEach((size, index) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "size-btn";
        btn.setAttribute("data-value", size);
        btn.setAttribute("aria-pressed", "false");
        btn.textContent = size;

        // Clique no botão de tamanho: alterna seleção
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          // desmarcar todos
          sizeContainer.querySelectorAll(".size-btn").forEach((b) => {
            b.setAttribute("aria-pressed", "false");
          });
          // marcar o atual
          btn.setAttribute("aria-pressed", "true");
          selectedSize = size;
        });

        sizeContainer.appendChild(btn);
      });
    }
  }

  // ------- BOTÕES: adicionar/remover/wishlist -------
  const addBtn = document.getElementById("add-to-cart-modal");
  const removeBtn = document.getElementById("remove-to-cart");
  const wishlistBtn = document.getElementById("add-to-wishlist-modal");

  if (addBtn) {
    // Passa o tamanho selecionado (se existir) para a função addToCart
    addBtn.onclick = () => {
      // Se o produto exige tamanho (sizeSection visível) e não foi selecionado, impede
      if (
        sizeSection &&
        sizeSection.style.display !== "none" &&
        sizeContainer &&
        sizeContainer.children.length > 0 &&
        !selectedSize
      ) {
        showToast("Selecione um tamanho antes de adicionar ao carrinho.");
        return;
      }
      // addToCart deve aceitar (productId, size) — caso sua função atual ignore size, continue funcionando
      addToCart(product.id, selectedSize);
      showToast("Produto adicionado ao carrinho.");
    };
  }

  if (removeBtn) {
    removeBtn.onclick = () => {
      removeFromCart(product.id);
      showToast("Produto removido do carrinho.");
    };
  }

  if (wishlistBtn) {
    wishlistBtn.onclick = () => {
      toggleWishlist(product.id);
      // atualizar ícone
      if (wishlistIcon) {
        wishlistIcon.className = isFavorite(product.id)
          ? "fas fa-heart"
          : "far fa-heart";
      }
      // re-render produtos para refletir mudança se quiser
      renderProducts("all");
      import("./productGrid.js").then(({ attachProductEventListeners }) => {
        if (attachProductEventListeners) attachProductEventListeners();
      });
    };
  }
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
        if (attachProductEventListeners) attachProductEventListeners();
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
