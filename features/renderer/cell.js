/**
 * @fileoverview Cell Renderer
 * @description Factory functions for creating timetable cell elements.
 *              Handles different cell types: classes, breaks, holidays, etc.
 * @module features/renderer/cell
 * @version 2.0.0
 */

import { CELL_TYPE, SECTION } from '../../core/constants.js';
import { createElement } from '../../core/utils.js';

/**
 * @typedef {Object} ClassData
 * @property {string} subject - Subject code (e.g., 'BCAC601')
 * @property {string} prof - Faculty ID (e.g., 'DB')
 * @property {string} [lab] - Lab room if applicable (e.g., 'LAB 1')
 */

/**
 * Create content fragment for a class entry
 * @param {ClassData} data - Class data object
 * @param {string} [sectionLabel] - Optional section label ('α' or 'β')
 * @returns {DocumentFragment} Fragment containing class content elements
 */
export function createClassContent(data, sectionLabel = null) {
    const container = document.createDocumentFragment();

    if (sectionLabel) {
        const label = createElement('div', { className: 'section-label-cell' }, [sectionLabel]);
        container.appendChild(label);
    }

    const subject = createElement('span', { className: 'subject-tag' }, [data.subject]);
    container.appendChild(subject);

    const prof = createElement('span', { className: 'prof-id' }, [data.prof]);
    container.appendChild(prof);

    if (data.lab) {
        const lab = createElement('span', { className: 'lab-tag' }, [data.lab]);
        container.appendChild(lab);
    }

    return container;
}

/**
 * Create a cell for both sections view
 */
export function createBothSectionsCell(alphaData, betaData) {
    const td = createElement('td', { dataset: { section: 'both' } });

    // Alpha section
    td.appendChild(createClassContent(alphaData, 'α'));

    // Divider
    const divider = createElement('hr', { className: 'divider' });
    td.appendChild(divider);

    // Beta section
    td.appendChild(createClassContent(betaData, 'β'));

    return td;
}

/**
 * Create a cell for single section view
 */
export function createSingleSectionCell(data) {
    const td = createElement('td', { dataset: { prof: data.prof } });
    td.appendChild(createClassContent(data));
    return td;
}

/**
 * Create an empty cell
 */
export function createEmptyCell() {
    const td = createElement('td', { className: 'cell-empty' }, ['----']);
    return td;
}

/**
 * Create a break cell
 */
export function createBreakCell() {
    const td = createElement('td', { className: 'break' }, ['BREAK']);
    return td;
}

/**
 * Create a holiday cell
 */
export function createHolidayCell(colspan = 1) {
    const td = createElement('td', { className: 'holiday', colspan: colspan.toString() }, ['HOLIDAY']);
    return td;
}

/**
 * Create a no-classes cell
 */
export function createNoClassesCell(colspan = 1) {
    const td = createElement('td', { className: 'no-classes', colspan: colspan.toString() }, ['NO CLASSES']);
    return td;
}

/**
 * Create a day cell
 */
export function createDayCell(dayName) {
    const td = createElement('td', { className: 'day' }, [dayName]);
    return td;
}

/**
 * Create a cell based on data type
 */
export function createCell(data, currentSection, alphaData = null, betaData = null) {
    if (data === CELL_TYPE.BREAK) {
        return createBreakCell();
    }

    if (data === CELL_TYPE.EMPTY || !data) {
        return createEmptyCell();
    }

    if (currentSection === SECTION.BOTH) {
        if (alphaData === CELL_TYPE.EMPTY || !alphaData) {
            return createEmptyCell();
        }
        return createBothSectionsCell(alphaData, betaData);
    }

    return createSingleSectionCell(data);
}
