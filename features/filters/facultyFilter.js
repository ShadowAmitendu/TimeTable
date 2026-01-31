/**
 * @fileoverview Faculty Filter Logic
 * @description Provides faculty-based filtering to highlight classes taught by
 *              a specific professor and dim all other classes.
 * @module features/filters/facultyFilter
 * @version 2.0.0
 */

import { $$, addClass, removeClass } from '../../core/utils.js';

/**
 * Toggle faculty filter highlighting
 * Highlights all cells with the selected professor and dims others.
 * Clicking the same button again removes the filter.
 * 
 * @param {string} profId - Faculty ID to filter by (e.g., 'DB', 'AP')
 * @param {HTMLElement} btn - The clicked filter button element
 * @example
 * // In HTML: onclick="toggleProf('DB', this)"
 */
export function toggleProf(profId, btn) {
    const isActive = btn.classList.contains('active');

    // Reset all tabs and cells
    $$('.prof-tab').forEach(t => removeClass(t, 'active'));
    $$('td').forEach(td => removeClass(td, 'dimmed', 'highlight-active'));

    if (!isActive) {
        // Apply filter
        document.body.classList.add('filter-active');
        addClass(btn, 'active');

        $$('td').forEach(td => {
            // Use data-prof attribute for accurate filtering
            const cellProf = td.dataset.prof;
            const cellText = td.innerText;

            if (cellProf === profId || cellText.includes(profId)) {
                addClass(td, 'highlight-active');
            } else if (
                cellText !== '---' &&
                !td.classList.contains('day') &&
                !td.classList.contains('break') &&
                !td.classList.contains('holiday') &&
                !td.classList.contains('no-classes')
            ) {
                addClass(td, 'dimmed');
            }
        });
    } else {
        // Remove filter
        document.body.classList.remove('filter-active');
    }
}

/**
 * Reset all faculty filters to default state
 * Removes active state from buttons and highlighting from cells.
 */
export function resetFilters() {
    document.body.classList.remove('filter-active');
    $$('.prof-tab').forEach(t => removeClass(t, 'active'));
    $$('td').forEach(td => removeClass(td, 'dimmed', 'highlight-active'));
}

/**
 * Check if any faculty filter is currently active
 * @returns {boolean} True if a filter is active
 */
export function isFilterActive() {
    return document.body.classList.contains('filter-active');
}
