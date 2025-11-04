// func/components.js
// Initializes self-contained UI components like the mobile menu and slider.

import { id } from "./domUtils.js";
import { AUTOPLAY_MS } from "./config.js";

export function initMobileMenu() {
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

export function initSlider() {
  const slidesEl = id("slides");
  const wrapper = document.querySelector(".slider .slides-wrapper");
  if (!slidesEl || !wrapper) return;
  const prev = id("prev"),
    next = id("next"),
    dots = id("dots");
  const slides = Array.from(slidesEl.children).filter((n) => n.nodeType === 1);
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
