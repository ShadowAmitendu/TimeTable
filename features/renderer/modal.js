/**
 * @fileoverview Section Selection Modal
 * @description Controls the welcome modal that allows users to select which
 *              section(s) to view. Shows on page load only if cookie expired.
 * @module features/renderer/modal
 * @version 2.1.0
 */

import { $, removeClass } from '../../core/utils.js';
import { SECTION_TEXT } from '../../data/config.js';

/** Cookie expiration time in minutes */
const COOKIE_EXPIRY_MINUTES = 30;

/** Cookie name for section preference */
const COOKIE_NAME = 'selectedSection';

/**
 * Set a cookie with expiration time
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} minutes - Expiration time in minutes
 */
function setCookie(name, value, minutes) {
    const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found/expired
 */
function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Save section preference to cookie
 * @param {string} section - Section identifier
 */
export function saveSectionPreference(section) {
    setCookie(COOKIE_NAME, section, COOKIE_EXPIRY_MINUTES);
}

/**
 * Get saved section preference from cookie
 * @returns {string|null} Saved section or null if expired/not set
 */
export function getSavedSection() {
    return getCookie(COOKIE_NAME);
}

/**
 * Show the section selection modal
 * Sets display to 'flex' for centered modal layout.
 */
export function showModal() {
    const modal = $('sectionModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

/**
 * Hide the section selection modal
 */
export function hideModal() {
    const modal = $('sectionModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Show the main content area (removes settings-hidden class)
 */
export function showContent() {
    const contentArea = $('contentArea');
    if (contentArea) {
        removeClass(contentArea, 'settings-hidden');
    }
}

/**
 * Handle modal button selection
 * @param {string} section - Selected section ('both', 'alpha', 'beta')
 * @param {Function} [onSelect] - Optional callback after selection
 */
export function handleModalSelection(section, onSelect) {
    hideModal();
    showContent();
    if (typeof onSelect === 'function') {
        onSelect(section);
    }
}

/**
 * Get human-readable display text for a section value
 * @param {string} section - Section identifier
 * @returns {string} Display text (e.g., "Both (α & β)")
 */
export function getSectionDisplayText(section) {
    return SECTION_TEXT[section] || SECTION_TEXT['both'];
}

/**
 * Initialize modal - shows only if cookie expired or not set
 * @returns {string|null} Saved section if exists, null if modal shown
 */
export function initModal() {
    const savedSection = getSavedSection();
    if (savedSection) {
        // Cookie still valid - skip modal, return saved preference
        hideModal();
        showContent();
        return savedSection;
    }
    // Cookie expired or not set - show modal
    showModal();
    return null;
}
