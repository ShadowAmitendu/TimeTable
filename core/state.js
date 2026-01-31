/**
 * @fileoverview Central Application State Management
 * @description Implements a simple reactive state pattern with subscribe/notify.
 *              All application state changes should flow through this module.
 * @module core/state
 * @version 2.0.0
 */

import { SECTION } from './constants.js';

/**
 * Central application state object
 * @type {Object}
 * @property {string} section - Currently selected section ('both', 'alpha', 'beta')
 * @property {string|null} activeFaculty - Currently filtered faculty ID, or null if no filter
 */
export const state = {
    section: SECTION.BOTH,
    activeFaculty: null
};

/**
 * Set of state change listener functions
 * @type {Set<Function>}
 * @private
 */
const listeners = new Set();

/**
 * Subscribe to state changes
 * @param {Function} listener - Callback function invoked with state on changes
 * @returns {Function} Unsubscribe function to remove the listener
 * @example
 * const unsubscribe = subscribe((state) => {
 *     console.log('Section changed to:', state.section);
 * });
 * // Later: unsubscribe();
 */
export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/**
 * Notify all subscribed listeners of state change
 * @private
 */
function notifyListeners() {
    listeners.forEach(listener => listener(state));
}

/**
 * Set the current section view
 * @param {string} section - Section identifier ('both', 'alpha', 'beta')
 */
export function setSection(section) {
    if (state.section !== section) {
        state.section = section;
        // Reset faculty filter when section changes
        state.activeFaculty = null;
        notifyListeners();
    }
}

/**
 * Set the active faculty filter (toggles off if same faculty)
 * @param {string} facultyId - Faculty identifier (e.g., 'DB', 'AP')
 */
export function setActiveFaculty(facultyId) {
    state.activeFaculty = state.activeFaculty === facultyId ? null : facultyId;
    notifyListeners();
}

/**
 * Get a shallow copy of the current state (prevents direct mutation)
 * @returns {Object} Copy of current state
 */
export function getState() {
    return { ...state };
}
