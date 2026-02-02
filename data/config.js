/**
 * @fileoverview Application Configuration
 * @description Centralized configuration for college, course, and display settings.
 *              Edit this file to customize the timetable for different institutions.
 * @module data/config
 * @version 2.0.0
 */

/**
 * Global application configuration
 * @readonly
 * @type {Object}
 * @property {string} college - Institution name
 * @property {string} course - Course/program name
 * @property {number} semester - Current semester number
 * @property {string} room - Classroom/room number
 * @property {string} routineDate - Date when schedule was last updated
 */
export const CONFIG = Object.freeze({
	college: "Techno College Hooghly",
	course: "BCA",
	semester: 6,
	room: "201",
	routineDate: "2nd February 2026",
});

/**
 * Human-readable display text for section options
 * @readonly
 * @type {Object.<string, string>}
 */
export const SECTION_TEXT = Object.freeze({
	both: "Both Alpha & Beta",
	alpha: "Section (Alpha)",
	beta: "Section (Beta)",
});
