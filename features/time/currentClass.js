/**
 * @fileoverview Current Class Highlighting
 * @description Automatically highlights the currently ongoing class based on
 *              system time, taking colspan and rowspan into account.
 * @module features/time/currentClass
 * @version 3.0.0
 */

import { $$, addClass, removeClass } from '../../core/utils.js';

export function highlightCurrentClass() {
	const now = new Date();
	const curDay = now.getDay();
	const curTime = now.getHours() * 60 + now.getMinutes();
	const headers = $$('thead th[data-start]');

	// Clear existing highlights
	$$('.current-class').forEach((el) => removeClass(el, 'current-class'));

	// Find active time slot index (0 to 8)
	let activeSlotIndex = -1;
	headers.forEach((th, slotIdx) => {
		if (!th.dataset.start || !th.dataset.end) return;
		const [startH, startM] = th.dataset.start.split(':').map(Number);
		const [endH, endM] = th.dataset.end.split(':').map(Number);
		const startTime = startH * 60 + startM;
		const endTime = endH * 60 + endM;

		if (curTime >= startTime && curTime < endTime) {
			activeSlotIndex = slotIdx;
		}
	});

	if (activeSlotIndex < 0) return;

	// Find rows for current day and highlight matching time slot cell
	$$('tbody tr').forEach((row) => {
		if (parseInt(row.dataset.day) === curDay) {
			let slotPointer = 0;
			row.querySelectorAll('td').forEach((td) => {
				if (
					td.classList.contains('cell-day') ||
					td.classList.contains('cell-sec') ||
					td.classList.contains('day')
				) {
					return;
				}
				const span = td.colSpan || 1;
				const cellStartSlot = slotPointer;
				const cellEndSlot = slotPointer + span - 1;

				if (
					activeSlotIndex >= cellStartSlot &&
					activeSlotIndex <= cellEndSlot
				) {
					addClass(td, 'current-class');
				}

				slotPointer += span;
			});
		}
	});
}

export function startHighlightInterval(intervalMs = 30000) {
	highlightCurrentClass();
	return setInterval(highlightCurrentClass, intervalMs);
}

export function stopHighlightInterval(intervalId) {
	if (intervalId) {
		clearInterval(intervalId);
	}
}
