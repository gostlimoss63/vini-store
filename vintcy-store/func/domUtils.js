// func/domUtils.js
// Reutilitários para manipulação do DOM.

/*
 * Seleciona um único elemento pelo seu ID.
 * @param {string} n - O ID do elemento.
 * @returns {Element|null} O elemento DOM ou null.
 */
export const id = (n) => document.getElementById(n);

/*
 * Seleciona um único elemento usando um seletor CSS.
 * @param {string} selector - O seletor CSS.
 * @returns {Element|null} O elemento DOM ou null.
 */
export const getElement = (selector) => document.querySelector(selector);

/*
 * Seleciona múltiplos elementos usando um seletor CSS.
 * @param {string} selector - O seletor CSS.
 * @returns {NodeList} Uma NodeList de elementos correspondentes.
 */
export const getElements = (selector) => document.querySelectorAll(selector);
