/**
 * @fileoverview Faculty Filter Logic
 * @description Provides faculty-based filtering to highlight classes taught by
 *              a specific professor and dim all other classes.
 * @module features/filters/facultyFilter
 * @version 3.0.0
 */

import { $$, addClass, removeClass } from '../../core/utils.js';

export function toggleProf(profId, btn) {
	const isActive = btn.classList.contains('active');

	// Reset all tabs and cells
	$$('.prof-tab').forEach((t) => removeClass(t, 'active'));
	$$('td').forEach((td) => removeClass(td, 'dimmed', 'highlight-active'));

	if (!isActive) {
		document.body.classList.add('filter-active');
		addClass(btn, 'active');

		$$('td').forEach((td) => {
			const cellProf = td.dataset.prof;
			const cellText = td.innerText;

			const isHeaderOrBreak =
				td.classList.contains('cell-day') ||
				td.classList.contains('cell-sec') ||
				td.classList.contains('cell-break') ||
				td.classList.contains('cell-empty') ||
				td.classList.contains('day') ||
				td.classList.contains('break') ||
				td.classList.contains('holiday');

			const isMatch =
				(cellProf && cellProf.includes(profId)) ||
				(cellText && cellText.includes(profId));

			if (isMatch) {
				addClass(td, 'highlight-active');
			} else if (!isHeaderOrBreak) {
				addClass(td, 'dimmed');
			}
		});
	} else {
		document.body.classList.remove('filter-active');
	}
}

export function resetFilters() {
	document.body.classList.remove('filter-active');
	$$('.prof-tab').forEach((t) => removeClass(t, 'active'));
	$$('td').forEach((td) => removeClass(td, 'dimmed', 'highlight-active'));
}

export function isFilterActive() {
	return document.body.classList.contains('filter-active');
}
