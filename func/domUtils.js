// func/domUtils.js
// Reusable utility functions for DOM manipulation.

/*
 * Selects a single element by its ID.
 * @param {string} n - The ID of the element.
 * @returns {Element|null} The DOM element or null.
 */
export const id = (n) => document.getElementById(n);

/*
 * Selects a single element using a CSS selector.
 * @param {string} selector - The CSS selector.
 * @returns {Element|null} The DOM element or null.
 */
export const getElement = (selector) => document.querySelector(selector);

/*
 * Selects multiple elements using a CSS selector.
 * @param {string} selector - The CSS selector.
 * @returns {NodeList} A NodeList of matching elements.
 */
export const getElements = (selector) => document.querySelectorAll(selector);