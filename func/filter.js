// func/filter.js
import { products } from "./data.js";
import { state } from "./state.js";

/**
 * Normalização de categorias para evitar variações de escrita.
 */
const CATEGORY_NORMALIZE = {
  casual: "casual",
  polos: "polos",
  social: "social",
  jaquetas: "jaquetas",
  moletons: "moletons",
  calças: "calças",
  calcas: "calças", // fallback sem acento
  bermudas: "bermudas",
  acessorios: "acessorios",
  accessories: "acessorios", // fallback inglês
  fashion: "casual",
  electronics: "electronics",
};

/**
 * Normaliza strings de forma segura
 */
function normalize(str) {
  return (str || "").toString().toLowerCase().trim();
}

/**
 * Filtra produtos baseado no estado global.
 */
export function filterProducts() {
  let filtered = [...products];

  // --- Filtro por categoria ---
  if (state.category && state.category !== "all") {
    const catKey = normalize(state.category);
    const normalizedCategory = CATEGORY_NORMALIZE[catKey] || catKey;

    filtered = filtered.filter(
      (p) => normalize(p.category) === normalizedCategory
    );
  }

  // FAVORITOS
  if (state.isFavoritesOnly) {
    filtered = filtered.filter((p) => state.wishlist.includes(p.id));
  }

  // --- Filtro por tab ---
  if (state.tab && state.tab !== "all") {
    const tabKey = normalize(state.tab);
    filtered = filtered.filter((p) => normalize(p.tab) === tabKey);
  }

  // --- Filtro por busca ---
  if (state.search && state.search.trim() !== "") {
    const term = normalize(state.search);

    filtered = filtered.filter(
      (p) =>
        normalize(p.name).includes(term) || normalize(p.category).includes(term)
    );
  }

  return filtered;
}
