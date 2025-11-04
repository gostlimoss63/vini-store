// func/filter.js
import { products } from "./data.js";
import { state } from "./state.js";

const CATEGORY_NORMALIZE = {
  casual: "casual",
  polos: "polos",
  social: "social",
  jaquetas: "jaquetas",
  moletons: "moletons",
  calças: "calças",
  calcas: "calças",
  bermudas: "bermudas",
  acessorios: "acessorios",
  accessories: "acessorios",
  fashion: "casual",
  "men's wear": "casual",
  electronics: "electronics",
};

export function filterProducts() {
  let filtered = [...products];

  // Categoria
  if (state.category && state.category !== "all") {
    const catKey = (state.category || "").toString().toLowerCase().trim();
    const normalized = CATEGORY_NORMALIZE[catKey] || catKey;
    filtered = filtered.filter(
      (p) => (p.category || "").toString().toLowerCase().trim() === normalized
    );
  }

  // Tab
  if (state.tab && state.tab !== "all") {
    const t = state.tab.toLowerCase();
    filtered = filtered.filter((p) => (p.tab || "").toLowerCase() === t);
  }

  // Search
  if (state.search && state.search.trim() !== "") {
    const s = state.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(s) ||
        (p.category || "").toLowerCase().includes(s)
    );
  }

  return filtered;
}
