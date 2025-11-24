// func/components.js
// Inicializa componentes como menu mobile e slider

import { id } from "./domUtils.js";
import { AUTOPLAY_MS } from "./config.js";

export function initMobileMenu() {
  const btn = id("btn-mobile");
  const menu = id("mobile-menu");

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
      if (e.target.tagName === "A") {
        btn.setAttribute("aria-expanded", "false");
        menu.setAttribute("hidden", "");
      }
    },
    { passive: true }
  );
}

export function initSlider() {
  const slidesEl = id("slides");
  const wrapper = document.querySelector(".slider .slides-wrapper");
  if (!slidesEl || !wrapper) return;

  const prev = id("prev");
  const next = id("next");
  const dots = id("dots");
  const slides = Array.from(slidesEl.children).filter((n) => n.nodeType === 1);
  const N = slides.length;

  if (!N) return;

  const applyWidths = () => {
    slidesEl.style.width = `${N * 100}%`;
    slides.forEach((s) => (s.style.width = `${100 / N}%`));
  };

  let cur = 0;
  let autoplayTimer = null;

  const pct = () => 100 / N;

  const go = (i, instant = false) => {
    const index = Math.min(Math.max(i, 0), N - 1);

    slidesEl.style.transition = instant ? "none" : "transform .45s ease";
    slidesEl.style.transform = `translateX(${-index * pct()}%)`;

    cur = index;

    if (instant) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          slidesEl.style.transition = "transform .45s ease";
        });
      });
    }

    updateUI();
  };

  const nextFn = () => go(cur + 1);
  const prevFn = () => go(cur - 1);

  const buildDots = () => {
    if (!dots) return;
    dots.innerHTML = "";

    if (N <= 1) return (dots.style.display = "none");

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

    if (dots) {
      [...dots.children].forEach((b, idx) => {
        idx === cur
          ? b.setAttribute("aria-current", "true")
          : b.removeAttribute("aria-current");
      });
    }
  };

  // Buttons
  prev?.addEventListener("click", () => {
    prevFn();
    resetAutoplay();
  });

  next?.addEventListener("click", () => {
    nextFn();
    resetAutoplay();
  });

  // Keyboard arrows
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevFn();
      resetAutoplay();
    } else if (e.key === "ArrowRight") {
      nextFn();
      resetAutoplay();
    }
  });

  // Touch swipe
  let startX = 0;
  let moveX = 0;

  wrapper.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      moveX = 0;
      slidesEl.style.transition = "none";
    },
    { passive: true }
  );

  wrapper.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length !== 1) return;
      moveX = e.touches[0].clientX - startX;
      slidesEl.style.transform = `translateX(${
        -(cur * pct()) + (moveX / wrapper.clientWidth) * pct()
      }%)`;
    },
    { passive: true }
  );

  wrapper.addEventListener("touchend", () => {
    slidesEl.style.transition = "transform .45s ease";
    if (Math.abs(moveX) > 30) moveX < 0 ? nextFn() : prevFn();
    else go(cur);
    resetAutoplay();
  });

  // Autoplay
  const startAutoplay = () => {
    if (!AUTOPLAY_MS || N <= 1) return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      cur < N - 1 ? nextFn() : go(0);
    }, AUTOPLAY_MS);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  // On resize
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      applyWidths();
      go(cur, true);
    }, 120);
  });

  applyWidths();
  buildDots();
  go(0, true);
  startAutoplay();
}
