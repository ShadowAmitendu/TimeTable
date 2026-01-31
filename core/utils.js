/**
 * @fileoverview DOM Utility Functions
 * @description Helper functions for DOM manipulation and element creation.
 *              Framework-agnostic utilities used throughout the application.
 * @module core/utils
 * @version 2.0.0
 */

/**
 * Get DOM element by ID (shorthand for document.getElementById)
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} The element, or null if not found
 * @example
 * const modal = $('sectionModal');
 */
export function $(id) {
    return document.getElementById(id);
}

/**
 * Query selector all (shorthand for document.querySelectorAll)
 * @param {string} selector - CSS selector
 * @returns {NodeListOf<Element>} List of matching elements
 * @example
 * const buttons = $$('.prof-tab');
 */
export function $$(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Create DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} [attributes={}] - Element attributes
 * @param {string} [attributes.className] - CSS class(es)
 * @param {Object} [attributes.dataset] - Data attributes
 * @param {Array<string|Node>} [children=[]] - Child nodes or text content
 * @returns {HTMLElement} The created element
 * @example
 * const btn = createElement('button', { className: 'modal-btn' }, ['Click me']);
 * const cell = createElement('td', { dataset: { day: '2' } }, [textNode]);
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else {
            element.setAttribute(key, value);
        }
    });

    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
            element.appendChild(child);
        }
    });

    return element;
}

/**
 * Toggle class on element
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class to toggle
 * @param {boolean} [force] - Force add (true) or remove (false)
 * @returns {boolean} Whether class is now present
 */
export function toggleClass(element, className, force) {
    return element.classList.toggle(className, force);
}

/**
 * Add one or more classes to element
 * @param {HTMLElement} element - Target element
 * @param {...string} classNames - Classes to add
 */
export function addClass(element, ...classNames) {
    element.classList.add(...classNames);
}

/**
 * Remove one or more classes from element
 * @param {HTMLElement} element - Target element
 * @param {...string} classNames - Classes to remove
 */
export function removeClass(element, ...classNames) {
    element.classList.remove(...classNames);
}
