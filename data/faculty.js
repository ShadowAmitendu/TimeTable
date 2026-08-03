/**
 * @fileoverview Faculty Data
 * @description List of faculty members and utility functions for faculty lookup.
 *              Update this file when faculty assignments change.
 * @module data/faculty
 * @version 2.0.0
 */

/**
 * @typedef {Object} FacultyMember
 * @property {string} id - Unique faculty identifier (short code)
 * @property {string} name - Display name
 */

/**
 * List of all faculty members teaching this semester
 * @readonly
 * @type {FacultyMember[]}
 */
export const FACULTY = Object.freeze([
	{ id: "SL", name: "SL (Salt Lake - Training)" },
	{ id: "SS1", name: "SS1" },
	{ id: "AM2", name: "AM2" },
	{ id: "BD", name: "BD" },
	{ id: "RN", name: "RN" },
	{ id: "AC", name: "AC" },
	{ id: "RB", name: "RB" },
	{ id: "SS4", name: "SS4" },
	{ id: "AD", name: "AD" },
]);

/**
 * Find a faculty member by their ID
 * @param {string} id - Faculty identifier
 * @returns {FacultyMember|undefined} Faculty object or undefined if not found
 * @example
 * const prof = getFacultyById('DB'); // { id: 'DB', name: 'DB' }
 */
export function getFacultyById(id) {
	return FACULTY.find((f) => f.id === id);
}

/**
 * Get array of all faculty IDs
 * @returns {string[]} Array of faculty identifiers
 * @example
 * const ids = getAllFacultyIds(); // ['DB', 'SM4', 'AP', ...]
 */
export function getAllFacultyIds() {
	return FACULTY.map((f) => f.id);
}
