/**
 * @fileoverview Time Slot Definitions
 * @description Defines class periods, break times, and time utility functions.
 *              Used for rendering table headers and highlighting current class.
 * @module data/timeSlots
 * @version 2.0.0
 */

/**
 * @typedef {Object} TimeSlot
 * @property {string} start - Start time in 24h format "HH:MM"
 * @property {string} end - End time in 24h format "HH:MM"
 * @property {string} displayStart - Start time formatted for display (12h)
 * @property {string} displayEnd - End time formatted for display (12h)
 * @property {boolean} [isBreak] - True if this is a break period
 */

/**
 * All time slots for the timetable (7 periods including break)
 * @readonly
 * @type {TimeSlot[]}
 */
export const TIME_SLOTS = Object.freeze([
	{
		start: "10:40",
		end: "11:30",
		displayStart: "10:40 AM",
		displayEnd: "11:30 AM",
	},
	{
		start: "11:35",
		end: "12:25",
		displayStart: "11:35 AM",
		displayEnd: "12:25 PM",
	},
	{
		start: "12:30",
		end: "13:20",
		displayStart: "12:30 PM",
		displayEnd: "01:20 PM",
	},
	{
		start: "13:20",
		end: "14:00",
		displayStart: "01:20 PM",
		displayEnd: "02:00 PM",
		isBreak: true,
	},
	{
		start: "14:00",
		end: "14:50",
		displayStart: "02:00 PM",
		displayEnd: "02:50 PM",
	},
	{
		start: "14:55",
		end: "15:45",
		displayStart: "02:55 PM",
		displayEnd: "03:45 PM",
	},
	{
		start: "15:50",
		end: "16:40",
		displayStart: "03:50 PM",
		displayEnd: "04:40 PM",
	},
]);

/**
 * Days of the week (index matches JavaScript Date.getDay())
 * @readonly
 * @type {string[]}
 */
export const DAYS = Object.freeze([
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
]);

/**
 * Convert time string "HH:MM" to minutes since midnight
 * @param {string} timeStr - Time in "HH:MM" format
 * @returns {number} Minutes since midnight (0-1439)
 * @example
 * parseTimeToMinutes("14:30"); // returns 870
 */
export function parseTimeToMinutes(timeStr) {
	const [hours, minutes] = timeStr.split(":").map(Number);
	return hours * 60 + minutes;
}

/**
 * Check if current system time falls within a time slot
 * @param {TimeSlot} slot - Time slot to check
 * @returns {boolean} True if current time is within slot
 */
export function isCurrentTimeInSlot(slot) {
	const now = new Date();
	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	const startMinutes = parseTimeToMinutes(slot.start);
	const endMinutes = parseTimeToMinutes(slot.end);
	return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

/**
 * Get the current day of the week (0=Sunday, 6=Saturday)
 * @returns {number} Day index (0-6)
 */
export function getCurrentDay() {
	return new Date().getDay();
}
