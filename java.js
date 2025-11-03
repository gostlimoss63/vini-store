// java.js — compact robust loader (BASE points to the fragment folder)
(() => {
  const BASE = "const/"; // change here if you move fragments
  const FRAGS = [
    "promotion_bar",
    "header",
    "slider",
    "categories",
    "product_grid",
    "footer",
  ];
  const AUTOPLAY_MS = 4500;

  const id = (n) => document.getElementById(n);

  // Product data (from script.txt)
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: 129.99,
      oldPrice: 199.99,
      image: "https://picsum.photos/seed/headphones/300/300.jpg",
      badge: "Sale",
      rating: 4.5,
      reviews: 42,
      tab: "sale",
    },
    {
      id: 2,
      name: "Stylish Leather Jacket",
      category: "Fashion",
      price: 189.99,
      oldPrice: null,
      image: "https://picsum.photos/seed/jacket/300/300.jpg",
      badge: "New",
      rating: 4.8,
      reviews: 28,
      tab: "new",
    },
    {
      id: 3,
      name: "Smart Home Security Camera",
      category: "Electronics",
      price: 79.99,
      oldPrice: 99.99,
      image: "https://picsum.photos/seed/camera/300/300.jpg",
      badge: "Sale",
      rating: 4.2,
      reviews: 15,
      tab: "sale",
    },
    {
      id: 4,
      name: "Organic Cotton T-Shirt",
      category: "Fashion",
      price: 29.99,
      oldPrice: null,
      image: "https://picsum.photos/seed/tshirt/300/300.jpg",
      badge: null,
      rating: 4.0,
      reviews: 36,
      tab: "best",
    },
    {
      id: 5,
      name: "Professional Yoga Mat",
      category: "Sports",
      price: 49.99,
      oldPrice: 69.99,
      image: "https://picsum.photos/seed/yogamat/300/300.jpg",
      badge: "Sale",
      rating: 4.7,
      reviews: 54,
      tab: "sale",
    },
    {
      id: 6,
      name: "Ceramic Plant Pot Set",
      category: "Home & Garden",
      price: 39.99,
      oldPrice: null,
      image: "https://picsum.photos/seed/plantpot/300/300.jpg",
      badge: "New",
      rating: 4.3,
      reviews: 22,
      tab: "new",
    },
    {
      id: 7,
      name: "Wireless Charging Pad",
      category: "Electronics",
      price: 24.99,
      oldPrice: null,
      image: "https://picsum.photos/seed/charger/300/300.jpg",
      badge: null,
      rating: 4.1,
      reviews: 18,
      tab: "best",
    },
    {
      id: 8,
      name: "Vintage Denim Jeans",
      category: "Fashion",
      price: 89.99,
      oldPrice: 119.99,
      image: "https://picsum.photos/seed/jeans/300/300.jpg",
      badge: "Sale",
      rating: 4.6,
      reviews: 31,
      tab: "sale",
    },
  ];

  // Initialize cart
  let cart = [];
  let cartCount = 0;

  async function fetchText(url) {
    try {
      const r = await fetch(url, { cache: "no-cache" });
      if (!r.ok) return `<!-- ${url} -> ${r.status} -->`;
      return await r.text();
    } catch (e) {
      return `<!-- ${url} fetch error: ${e && e.message} -->`;
    }
  }

  async function loadFragments() {
    const jobs = FRAGS.map((name) =>
      fetchText(`${BASE}${name}.html`).then((html) => ({ name, html }))
    );
    const settled = await Promise.allSettled(jobs);
    settled.forEach((s) => {
      if (s.status !== "fulfilled")
        return console.warn("fragment job failed", s);
      const { name, html } = s.value;
      const slot = id(name);
      if (slot)
        slot.innerHTML = html && html.trim() ? html : `<!-- ${name} empty -->`;
      else console.warn(`Missing placeholder id="${name}"`);
    });
    console.info("Fragments mounted (base:", BASE, ")");

    // Initialize product grid after fragments are loaded
    setTimeout(() => {
      initProductGrid();
      initSearchBar();
    }, 100); // Small delay to ensure DOM is ready
  }

  // Generate star rating HTML
  function generateStars(rating) {
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

  // Render products
  // Render products
  function renderProducts(source = "all") {
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

    // Add event listeners to new elements
    attachProductEventListeners();
  }

  // Attach event listeners to product elements
  function attachProductEventListeners() {
    // Quick view buttons
    document.querySelectorAll(".quick-view").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        showProductModal(productId);
      });
    });

    // Add to cart buttons
    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        addToCart(productId);
      });
    });

    // Add to wishlist buttons
    document.querySelectorAll(".add-to-wishlist").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = parseInt(this.getAttribute("data-id"));
        addToWishlist(productId);
      });
    });
  }

  // Show product modal
  function showProductModal(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    // Create modal if it doesn't exist
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

      // Add close functionality
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

    modal.classList.add("active");
  }

  // Add to cart function
  function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
      });
    }

    updateCartCount();
    showToast(`${product.name} added to cart!`);
  }

  // Update cart count
  function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) cartCountElement.textContent = cartCount;
  }

  // Add to wishlist function
  function addToWishlist(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    showToast(`${product.name} added to wishlist!`);
  }

  // Show toast notification
  function showToast(message) {
    // Create toast if it doesn't exist
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

  // Initialize product grid
  // Initialize product grid
  // Initialize product grid
  function initProductGrid() {
    console.log("Initializing product grid...");

    // Set up tab functionality
    const tabButtons = document.querySelectorAll(".product_grid .tab-btn");
    if (tabButtons.length > 0) {
      tabButtons.forEach((button) => {
        button.addEventListener("click", function () {
          // Remove active class from all tabs
          tabButtons.forEach((btn) => btn.classList.remove("active"));
          // Add active class to clicked tab
          this.classList.add("active");

          // Get the filter value from the clicked tab
          const filter = this.getAttribute("data-tab");
          // Render products with the selected filter
          renderProducts(filter);
        });
      });
    }

    // Set up sort functionality
    const sortSelect = document.querySelector(".product_grid select");
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

        // Get the currently active tab
        const activeTab = document.querySelector(
          ".product_grid .tab-btn.active"
        );
        const filter = activeTab ? activeTab.getAttribute("data-tab") : "all";

        // Replace products array with sorted one temporarily
        const temp = products;
        products.splice(0, products.length, ...sortedProducts);
        renderProducts(filter);
        products.splice(0, products.length, ...temp);
      });
    }

    // Initial render
    renderProducts();
    console.log("Product grid initialized");
  }

  function initSearchBar() {
    const searchDesktop = document.getElementById("search-desktop");
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

  // mobile menu
  function initMobileMenu() {
    const btn = id("btn-mobile"),
      menu = id("mobile-menu");
    if (!btn || !menu) return;
    if (!btn.hasAttribute("aria-expanded"))
      btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      open ? menu.setAttribute("hidden", "") : menu.removeAttribute("hidden");
    });
    menu.addEventListener(
      "click",
      (e) => {
        if (e.target && e.target.tagName === "A") {
          btn.setAttribute("aria-expanded", "false");
          menu.setAttribute("hidden", "");
        }
      },
      { passive: true }
    );
  }

  // slider (compact)
  function initSlider() {
    const slidesEl = id("slides");
    const wrapper = document.querySelector(".slider .slides-wrapper");
    if (!slidesEl || !wrapper) return;
    const prev = id("prev"),
      next = id("next"),
      dots = id("dots");
    const slides = Array.from(slidesEl.children).filter(
      (n) => n.nodeType === 1
    );
    const N = slides.length;
    if (N === 0) return;

    const applyWidths = () => {
      slidesEl.style.width = N * 100 + "%";
      slides.forEach((s) => (s.style.width = 100 / N + "%"));
    };

    let cur = 0,
      at = null;
    const pct = () => 100 / N;
    const go = (i, instant) => {
      const t = Math.max(0, Math.min(i | 0, N - 1));
      slidesEl.style.transition = instant ? "none" : "transform .45s ease";
      slidesEl.style.transform = `translateX(${-t * pct()}%)`;
      cur = t;
      if (instant)
        requestAnimationFrame(() =>
          requestAnimationFrame(
            () => (slidesEl.style.transition = "transform .45s ease")
          )
        );
      updateUI();
    };
    const nextFn = () => go(cur + 1),
      prevFn = () => go(cur - 1);

    const buildDots = () => {
      if (!dots) return;
      dots.innerHTML = "";
      if (N <= 1) {
        dots.style.display = "none";
        return;
      }
      for (let i = 0; i < N; i++) {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.i = i;
        b.ariaLabel = `Ir para slide ${i + 1}`;
        b.addEventListener("click", () => {
          go(i);
          resetAutoplay();
        });
        dots.appendChild(b);
      }
    };

    const updateUI = () => {
      if (prev) prev.disabled = cur === 0;
      if (next) next.disabled = cur === N - 1;
      if (dots)
        Array.from(dots.children).forEach((b, idx) =>
          idx === cur
            ? b.setAttribute("aria-current", "true")
            : b.removeAttribute("aria-current")
        );
    };

    if (prev)
      prev.addEventListener("click", () => {
        prevFn();
        resetAutoplay();
      });
    if (next)
      next.addEventListener("click", () => {
        nextFn();
        resetAutoplay();
      });
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        prevFn();
        resetAutoplay();
      }
      if (e.key === "ArrowRight") {
        nextFn();
        resetAutoplay();
      }
    });

    // swipe
    let sx = 0,
      dx = 0;
    const TH = 30;
    wrapper.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) return;
        sx = e.touches[0].clientX;
        dx = 0;
        slidesEl.style.transition = "none";
      },
      { passive: true }
    );
    wrapper.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length !== 1) return;
        dx = e.touches[0].clientX - sx;
        slidesEl.style.transform = `translateX(${
          -(cur * pct()) + (dx / (wrapper.clientWidth || 1)) * pct()
        }%)`;
      },
      { passive: true }
    );
    wrapper.addEventListener("touchend", () => {
      slidesEl.style.transition = "transform .45s ease";
      if (Math.abs(dx) > TH) dx < 0 ? nextFn() : prevFn();
      else go(cur);
      resetAutoplay();
    });

    // autoplay
    const startAutoplay = () => {
      if (!AUTOPLAY_MS || N <= 1) return;
      stopAutoplay();
      at = setInterval(() => (cur < N - 1 ? nextFn() : go(0)), AUTOPLAY_MS);
    };
    const stopAutoplay = () => {
      if (at) {
        clearInterval(at);
        at = null;
      }
    };
    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    // resize debounce
    let rt = null;
    window.addEventListener("resize", () => {
      if (rt) clearTimeout(rt);
      rt = setTimeout(() => {
        applyWidths();
        go(cur, true);
      }, 120);
    });

    applyWidths();
    buildDots();
    go(0, true);
    startAutoplay();
  }

  async function init() {
    try {
      // Aguarda fragments carregarem (header, footer etc.)
      await Promise.allSettled([loadFragments()]);
      await Promise.resolve(); // permite o parse do DOM

      // Agora pode inicializar tudo o resto
      renderProducts("all");
      initSearchBar();

      initMobileMenu();
      initSlider();

      console.log("✅ Loja inicializada!");
    } catch (e) {
      console.error("Erro na inicialização:", e);
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();

  // helpful local-file hint (file:// can block fetch)
  setTimeout(() => {
    const empty = FRAGS.every((n) => {
      const el = id(n);
      return el && el.innerHTML.trim().length === 0;
    });
    if (empty) {
      console.warn(
        "Fragments empty — if you opened index.html via file:// the browser may block fetch. Run a local server (e.g. python -m http.server)."
      );
      const note = document.createElement("div");
      note.textContent = "Fragments failed to load — see console";
      Object.assign(note.style, {
        position: "fixed",
        left: 8,
        bottom: 8,
        padding: "8px 12px",
        background: "rgba(0,0,0,.75)",
        color: "#fff",
        zIndex: 9999,
        borderRadius: "6px",
        fontSize: "13px",
      });
      document.body.appendChild(note);
    }
  }, 900);
})();
// Debug function to check if elements exist
function debugProductGrid() {
  console.log("Debugging product grid...");
  console.log("Product grid element:", document.querySelector(".product_grid"));
  console.log(
    "Products container:",
    document.querySelector(".product_grid .products-container")
  );
  console.log("Products data:", products);
  console.log("Number of products:", products.length);
}

// Call this function in the browser console to debug
window.debugProductGrid = debugProductGrid;
