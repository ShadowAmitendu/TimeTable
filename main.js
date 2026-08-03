/**
 * @fileoverview Application Entry Point
 * @description Main entry point for the ES module version of the timetable app.
 *              Initializes all modules, loads schedule data from JSON, and sets up
 *              global functions for HTML event handlers.
 * @module main
 * @version 2.0.0
 * @requires core/constants
 * @requires core/utils
 * @requires features/renderer/table
 * @requires features/renderer/header
 * @requires features/renderer/modal
 * @requires features/filters/facultyFilter
 * @requires features/time/currentClass
 * @requires features/print/printMode
 */

import { SECTION } from './core/constants.js';
import { $ } from './core/utils.js';
import { renderSchedule, setScheduleData } from './features/renderer/table.js';
import { renderHeader } from './features/renderer/header.js';
import { initModal, hideModal, showContent, getSectionDisplayText, saveSectionPreference } from './features/renderer/modal.js';
import { toggleProf, resetFilters } from './features/filters/facultyFilter.js';
import { startHighlightInterval } from './features/time/currentClass.js';
import { initPrintButton } from './features/print/printMode.js';

/**
 * Currently selected section state
 * @type {string}
 */
let currentSection = SECTION.BOTH;

/**
 * Fetch schedule data from external JSON file
 * @async
 * @returns {Promise<Object|null>} Schedule data or null on error
 */
async function loadScheduleData() {
    try {
        const response = await fetch('./data/schedule.json');
        if (!response.ok) throw new Error('Failed to load schedule data');
        return await response.json();
    } catch (error) {
        console.error('Error loading schedule:', error);
        return null;
    }
}

/**
 * Initialize the application
 * - Loads schedule data from JSON
 * - Renders header and initializes modal
 * - Sets up print button and current class highlighting
 * - Registers global functions for HTML onclick handlers
 * @async
 */
async function init() {
    // Load schedule data from JSON
    const scheduleData = await loadScheduleData();
    if (scheduleData) {
        setScheduleData(scheduleData);
    }

    // Render header (updates document title)
    renderHeader();

    // Check for saved section cookie
    const savedSection = initModal();
    if (savedSection) {
        currentSection = savedSection;
        updateSelection(savedSection, getSectionDisplayText(savedSection));
    } else {
        currentSection = SECTION.BOTH;
    }
    renderSchedule(currentSection);

    // Initialize print button click handler
    initPrintButton();

    // Start 30-second interval for current class highlighting
    startHighlightInterval(30000);

    // Set up global functions for inline HTML event handlers
    setupGlobalFunctions();
}

/**
 * Register global functions on window object for HTML onclick handlers
 * Maintains backward compatibility with inline event handlers in HTML.
 * @private
 */
function setupGlobalFunctions() {
    /**
     * Handle section selection from welcome modal
     * @param {string} section - Selected section ('both', 'alpha', 'beta')
     */
    window.selectFromModal = function (section) {
        saveSectionPreference(section);
        hideModal();
        showContent();
        currentSection = section;
        updateSelection(section, getSectionDisplayText(section));
        renderSchedule(currentSection);
    };

    /**
     * Toggle settings panel visibility
     */
    window.toggleSettings = function () {
        const modal = $('optionsModal') || document.getElementById('optionsModal');
        if (modal) {
            if (modal.style.display === 'flex') {
                modal.style.display = 'none';
            } else {
                modal.style.display = 'flex';
            }
        }
    };

    window.addEventListener('click', function (e) {
        const modal = $('optionsModal') || document.getElementById('optionsModal');
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });

    /**
     * Toggle section dropdown menu
     */
    window.toggleDropdown = function () {
        $('selectOptions').classList.toggle('show');
    };

    /**
     * Update section selection from dropdown
     * @param {string} val - Section value
     * @param {string} text - Display text
     */
    window.updateSelection = function (val, text) {
        currentSection = val;
        saveSectionPreference(val);
        $('selectedVal').textContent = text;
        $('selectOptions').classList.remove('show');
        resetFilters();
        renderSchedule(currentSection);
    };

    // Expose faculty filter toggle to global scope
    window.toggleProf = toggleProf;

    window.toggleTheme = function () {
        const currentTheme = document.body.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    };

    function updateThemeIcon(theme) {
        const sun = $('sunIcon') || document.getElementById('sunIcon');
        const moon = $('moonIcon') || document.getElementById('moonIcon');
        if (theme === 'light') {
            if (sun) sun.style.display = 'none';
            if (moon) moon.style.display = 'inline-block';
        } else {
            if (sun) sun.style.display = 'inline-block';
            if (moon) moon.style.display = 'none';
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

/**
 * Update the selection display text
 * @param {string} val - Section value
 * @param {string} text - Display text
 * @private
 */
function updateSelection(val, text) {
    $('selectedVal').textContent = text;
    $('selectOptions').classList.remove('show');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
