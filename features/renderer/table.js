/**
 * @fileoverview Table Renderer
 * @description Main timetable rendering logic. Generates table rows for each day,
 *              handles section switching, and smart-merges identical classes.
 * @module features/renderer/table
 * @version 2.0.0
 */

import { CELL_TYPE, SECTION } from '../../core/constants.js';
import { DAYS } from '../../data/timeSlots.js';
import { createElement, $ } from '../../core/utils.js';
import {
    createDayCell,
    createHolidayCell,
    createNoClassesCell,
    createBreakCell,
    createCell
} from './cell.js';
import { highlightCurrentClass } from '../time/currentClass.js';

/**
 * Schedule data loaded from JSON file
 * @type {Object|null}
 * @private
 */
let scheduleData = null;

/**
 * Set the schedule data (called after JSON fetch)
 * @param {Object} data - Schedule data with 'alpha' and 'beta' properties
 * @param {Object} data.alpha - Alpha section schedule keyed by day index
 * @param {Object} data.beta - Beta section schedule keyed by day index
 */
export function setScheduleData(data) {
    scheduleData = data;
}

/**
 * Check if two class entries represent the same class
 * Used to merge identical entries in "Both" view.
 * @param {Object|string} alpha - Alpha section class data or cell type string
 * @param {Object|string} beta - Beta section class data or cell type string
 * @returns {boolean} True if same subject AND same professor
 * @private
 */
function isSameClass(alpha, beta) {
    if (typeof alpha === 'string' || typeof beta === 'string') return false;
    if (!alpha || !beta) return false;
    return alpha.subject === beta.subject && alpha.prof === beta.prof;
}

/**
 * Create table row for Sunday (holiday)
 * @returns {HTMLTableRowElement} TR element with holiday cells
 * @private
 */
function createSundayRow() {
    const tr = createElement('tr');
    tr.appendChild(createDayCell('Sunday'));
    tr.appendChild(createHolidayCell(3));
    tr.appendChild(createElement('td', { className: 'break' }, ['---']));
    tr.appendChild(createHolidayCell(3));
    return tr;
}

/**
 * Create a row for Monday (no classes)
 */
function createMondayRow() {
    const tr = createElement('tr');
    tr.appendChild(createDayCell('Monday'));
    tr.appendChild(createNoClassesCell(3));
    tr.appendChild(createElement('td', { className: 'break' }, ['---']));
    tr.appendChild(createNoClassesCell(3));
    return tr;
}

/**
 * Create a row for a regular day
 */
function createDayRow(dayIndex, currentSection) {
    const tr = createElement('tr', { dataset: { day: dayIndex.toString() } });
    tr.appendChild(createDayCell(DAYS[dayIndex]));

    if (!scheduleData) return tr;

    const alphaSchedule = scheduleData.alpha[dayIndex];
    const betaSchedule = scheduleData.beta[dayIndex];

    for (let slot = 0; slot < 7; slot++) {
        const alphaData = alphaSchedule[slot];
        const betaData = betaSchedule[slot];

        if (alphaData === CELL_TYPE.BREAK || alphaData === 'BREAK') {
            tr.appendChild(createBreakCell());
            continue;
        }

        if (currentSection === SECTION.BOTH) {
            const alphaIsEmpty = alphaData === CELL_TYPE.EMPTY || alphaData === 'EMPTY' || !alphaData;
            const betaIsEmpty = betaData === CELL_TYPE.EMPTY || betaData === 'EMPTY' || !betaData;

            // Both sections empty - show ---
            if (alphaIsEmpty && betaIsEmpty) {
                tr.appendChild(createElement('td', {}, ['---']));
            }
            // Same class in both sections - show single merged cell
            else if (isSameClass(alphaData, betaData)) {
                const td = createElement('td', { dataset: { prof: alphaData.prof } });
                const subject = createElement('span', { className: 'subject-tag' }, [alphaData.subject]);
                td.appendChild(subject);
                const prof = createElement('span', { className: 'prof-id' }, [alphaData.prof]);
                td.appendChild(prof);
                if (alphaData.lab) {
                    const lab = createElement('span', { className: 'lab-tag' }, [alphaData.lab]);
                    td.appendChild(lab);
                }
                tr.appendChild(td);
            }
            // Different classes - show split cell with α and β
            else {
                const td = createElement('td', { dataset: { section: 'both' } });

                // Alpha section content
                const alphaLabel = createElement('div', { className: 'section-label-cell' }, ['α']);
                td.appendChild(alphaLabel);
                if (alphaIsEmpty) {
                    const emptyText = createElement('span', { className: 'subject-tag empty-class' }, ['No Class']);
                    td.appendChild(emptyText);
                } else {
                    const alphaSubject = createElement('span', { className: 'subject-tag' }, [alphaData.subject]);
                    td.appendChild(alphaSubject);
                    const alphaProf = createElement('span', { className: 'prof-id' }, [alphaData.prof]);
                    td.appendChild(alphaProf);
                    if (alphaData.lab) {
                        const alphaLab = createElement('span', { className: 'lab-tag' }, [alphaData.lab]);
                        td.appendChild(alphaLab);
                    }
                }

                // Divider
                const divider = createElement('hr', { className: 'divider' });
                td.appendChild(divider);

                // Beta section content
                const betaLabel = createElement('div', { className: 'section-label-cell' }, ['β']);
                td.appendChild(betaLabel);
                if (betaIsEmpty) {
                    const emptyText = createElement('span', { className: 'subject-tag empty-class' }, ['No Class']);
                    td.appendChild(emptyText);
                } else {
                    const betaSubject = createElement('span', { className: 'subject-tag' }, [betaData.subject]);
                    td.appendChild(betaSubject);
                    const betaProf = createElement('span', { className: 'prof-id' }, [betaData.prof]);
                    td.appendChild(betaProf);
                    if (betaData.lab) {
                        const betaLab = createElement('span', { className: 'lab-tag' }, [betaData.lab]);
                        td.appendChild(betaLab);
                    }
                }

                tr.appendChild(td);
            }
        } else {
            const schedule = currentSection === SECTION.ALPHA ? scheduleData.alpha : scheduleData.beta;
            const data = schedule[dayIndex][slot];

            if (data === CELL_TYPE.EMPTY || data === 'EMPTY' || !data) {
                tr.appendChild(createElement('td', {}, ['---']));
            } else {
                const td = createElement('td', { dataset: { prof: data.prof } });
                const subject = createElement('span', { className: 'subject-tag' }, [data.subject]);
                td.appendChild(subject);
                const prof = createElement('span', { className: 'prof-id' }, [data.prof]);
                td.appendChild(prof);
                if (data.lab) {
                    const lab = createElement('span', { className: 'lab-tag' }, [data.lab]);
                    td.appendChild(lab);
                }
                tr.appendChild(td);
            }
        }
    }

    return tr;
}

/**
 * Render the full schedule table
 */
export function renderSchedule(currentSection) {
    const tbody = $('timetableBody');
    if (!tbody) return;

    // Clear existing content
    tbody.innerHTML = '';

    // Add Sunday row
    tbody.appendChild(createSundayRow());

    // Add Monday row
    tbody.appendChild(createMondayRow());

    // Add Tuesday through Saturday rows
    for (let i = 2; i <= 6; i++) {
        tbody.appendChild(createDayRow(i, currentSection));
    }

    // Highlight current class
    highlightCurrentClass();
}
