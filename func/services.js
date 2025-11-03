// func/services.js
// Service functions for external operations like fetching data.

import { BASE, FRAGS } from './config.js';
import { id } from './domUtils.js';

/*
 * Fetches text content from a given URL.
 * @param {string} url - The URL to fetch.
 * @returns {Promise<string>} A promise that resolves with the text content.
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
 * Loads all HTML fragments into the DOM.
 */
export async function loadFragments() {
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
}