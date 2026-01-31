/**
 * @fileoverview Header Renderer
 * @description Renders and updates the page header with configuration data.
 *              Provides hook for dynamic header updates if needed.
 * @module features/renderer/header
 * @version 2.0.0
 */

import { CONFIG } from '../../data/config.js';

/**
 * Render/update the page header with config data
 * Updates the document title. Header HTML is static but this provides
 * a hook for future dynamic updates.
 */
export function renderHeader() {
    // Update document title dynamically
    document.title = `${CONFIG.course} ${CONFIG.semester}th Sem Timetable | ${CONFIG.college}`;
}

/**
 * Get formatted header subtitle text
 * @returns {string} Formatted string like "BCA 6th Sem • Room 201"
 */
export function getHeaderSubtitle() {
    return `${CONFIG.course} ${CONFIG.semester}th Sem • Room ${CONFIG.room}`;
}

/**
 * Get college name from configuration
 * @returns {string} College name
 */
export function getCollegeName() {
    return CONFIG.college;
}
