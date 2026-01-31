/**
 * @fileoverview Application Constants
 * @description Defines immutable constants used throughout the application.
 *              All magic strings should be replaced with these constants.
 * @module core/constants
 * @version 2.0.0
 */

/**
 * Cell type constants for timetable entries
 * @readonly
 * @enum {string}
 * @property {string} BREAK - Lunch/recess break period
 * @property {string} EMPTY - No scheduled class
 * @property {string} HOLIDAY - Holiday (no college)
 * @property {string} NO_CLASSES - College open but no classes scheduled
 */
export const CELL_TYPE = Object.freeze({
    BREAK: 'BREAK',
    EMPTY: 'EMPTY',
    HOLIDAY: 'HOLIDAY',
    NO_CLASSES: 'NO_CLASSES'
});

/**
 * Section identifiers for filtering timetable view
 * @readonly
 * @enum {string}
 * @property {string} BOTH - Show both Alpha and Beta sections
 * @property {string} ALPHA - Show only Alpha section
 * @property {string} BETA - Show only Beta section
 */
export const SECTION = Object.freeze({
    BOTH: 'both',
    ALPHA: 'alpha',
    BETA: 'beta'
});

/**
 * Day indices matching JavaScript's Date.getDay() return values
 * @readonly
 * @enum {number}
 * @property {number} SUNDAY - 0
 * @property {number} MONDAY - 1
 * @property {number} TUESDAY - 2
 * @property {number} WEDNESDAY - 3
 * @property {number} THURSDAY - 4
 * @property {number} FRIDAY - 5
 * @property {number} SATURDAY - 6
 */
export const DAY_INDEX = Object.freeze({
    SUNDAY: 0,
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6
});
