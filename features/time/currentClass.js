/**
 * @fileoverview Current Class Highlighting
 * @description Automatically highlights the currently ongoing class based on
 *              system time. Updates every 30 seconds by default.
 * @module features/time/currentClass
 * @version 2.0.0
 */

import { $$, addClass, removeClass } from '../../core/utils.js';

/**
 * Highlight the current class based on system time
 * Compares current time against data-start/data-end attributes on table headers.
 * Adds 'current-class' class to the matching cell.
 */
export function highlightCurrentClass() {
    const now = new Date();
    const curDay = now.getDay();
    const curTime = now.getHours() * 60 + now.getMinutes();
    const headers = $$('thead th');

    // Clear existing highlights
    $$('.current-class').forEach(el => removeClass(el, 'current-class'));

    // Find rows for current day and highlight matching time slot
    $$('tbody tr').forEach(row => {
        if (parseInt(row.dataset.day) === curDay) {
            const cells = row.querySelectorAll('td');
            headers.forEach((th, index) => {
                if (index === 0 || !th.dataset.start) return;

                const [startH, startM] = th.dataset.start.split(':').map(Number);
                const [endH, endM] = th.dataset.end.split(':').map(Number);
                const startTime = startH * 60 + startM;
                const endTime = endH * 60 + endM;

                if (curTime >= startTime && curTime < endTime) {
                    addClass(cells[index], 'current-class');
                }
            });
        }
    });
}

/**
 * Start automatic highlighting interval
 * @param {number} [intervalMs=30000] - Update interval in milliseconds
 * @returns {number} Interval ID (use with stopHighlightInterval to cancel)
 * @example
 * const intervalId = startHighlightInterval(30000);
 * // Later: stopHighlightInterval(intervalId);
 */
export function startHighlightInterval(intervalMs = 30000) {
    // Initial highlight
    highlightCurrentClass();

    // Set up interval for periodic updates
    return setInterval(highlightCurrentClass, intervalMs);
}

/**
 * Stop automatic highlighting
 * @param {number} intervalId - Interval ID from startHighlightInterval
 */
export function stopHighlightInterval(intervalId) {
    if (intervalId) {
        clearInterval(intervalId);
    }
}
