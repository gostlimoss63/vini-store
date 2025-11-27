// func/services.js
// Funções de serviço para carregar fragmentos HTML.

import { BASE, FRAGS } from "./config.js";
import { id } from "./domUtils.js";

/*
 * Busca o conteúdo de texto de uma URL fornecida.
 * @param {string} url - A URL para buscar.
 * @returns {Promise<string>} Uma promessa que resolve com o conteúdo de texto.
 */
export async function fetchText(url) {
  try {
    const r = await fetch(url, { cache: "no-cache" });
    if (!r.ok) return `<!-- ${url} -> ${r.status} -->`;
    return await r.text();
  } catch (e) {
    return `<!-- ${url} fetch error: ${e && e.message} -->`;
  }
}

/*
 * Carrega todos os fragmentos HTML no DOM.
 */
export async function loadFragments() {
  const jobs = FRAGS.map((name) =>
    fetchText(`${BASE}${name}.html`).then((html) => ({ name, html }))
  );
  const settled = await Promise.allSettled(jobs);
  settled.forEach((s) => {
    if (s.status !== "fulfilled") return console.warn("fragment job failed", s);
    const { name, html } = s.value;
    const slot = id(name);
    if (slot)
      slot.innerHTML = html && html.trim() ? html : `<!-- ${name} empty -->`;
    else console.warn(`Missing placeholder id="${name}"`);
  });
  console.info("Fragments mounted (base:", BASE, ")");
}
