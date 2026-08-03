/**
 * @fileoverview Table Renderer
 * @description Renders the timetable grid with smart horizontal (colspan) and vertical (rowspan) cell merging,
 *              supporting Day and Sec (BOTH/ALPHA/BETA) columns and subject color badges.
 * @module features/renderer/table
 * @version 3.0.0
 */

import { SECTION } from '../../core/constants.js';
import { DAYS } from '../../data/timeSlots.js';
import { $, createElement } from '../../core/utils.js';
import { highlightCurrentClass } from '../time/currentClass.js';

let scheduleData = null;

export function setScheduleData(data) {
	scheduleData = data;
}

function isSameItem(a, b) {
	if (a === b) return true;
	if (!a || !b) return false;
	if (typeof a === 'string' || typeof b === 'string') return false;
	return a.subject === b.subject && a.prof === b.prof && a.lab === b.lab;
}

function getCellInfo(item) {
	if (!item || item === 'EMPTY') {
		return { css: 'cell-empty', html: '----', prof: '' };
	}
	if (item === 'BREAK') {
		return { css: 'cell-break', html: 'BREAK', prof: '' };
	}
	const s = item.subject || '';
	const p = item.prof || '';
	const l = item.lab || '';

	let css = 'subj-default';
	if (s === 'Project') css = 'subj-project';
	else if (s === 'MIM701A' && p === 'SS1') css = 'subj-mim701a-ss1';
	else if (s === 'MIM701A' && p === 'AM2') css = 'subj-mim701a-am2';
	else if (s === 'MIM701A' && p === 'RB') css = 'subj-mim701a-rb';
	else if (s === 'BCAC703') css = 'subj-bcac703';
	else if (s.includes('BCAC701B') || s.includes('701A'))
		css = 'subj-bcac701b-701a';
	else if (s === 'BCAC791B') css = 'subj-bcac791b';
	else if (s === 'BCAC792') css = 'subj-bcac792';
	else if (s === 'BCAC702') css = 'subj-bcac702';
	else if (s === 'BCAC791A') css = 'subj-bcac791a';

	let html = '';
	if (s === 'BCAC701B/701A') {
		html = 'BCAC701B RN<br/>/ 701A AC';
	} else if (s === 'Project') {
		html = 'Classes at Salt Lake<br/>(Industrial Training)';
	} else {
		html = `${s} ${p}`;
		if (l) html += `<br/>${l}`;
	}

	return { css, html, prof: p };
}

function countHorizontalSpan(row, startSlot) {
	const first = row[startSlot];
	if (!first || typeof first === 'string') return 1;
	if (first.subject !== 'Project') return 1;
	let span = 1;
	for (let i = startSlot + 1; i < 9; i++) {
		if (isSameItem(first, row[i])) {
			span++;
		} else {
			break;
		}
	}
	return span;
}

function countMergedBothSpan(alphaRow, betaRow, startSlot) {
	const firstAlpha = alphaRow[startSlot];
	if (!firstAlpha || firstAlpha === 'EMPTY') return 0;
	const firstBeta = betaRow[startSlot];
	if (!firstBeta || firstBeta === 'EMPTY') return 0;
	if (!isSameItem(firstAlpha, firstBeta)) return 0;

	if (typeof firstAlpha === 'object' && firstAlpha.subject === 'Project') {
		let span = 0;
		for (let i = startSlot; i < 9; i++) {
			if (
				isSameItem(alphaRow[i], betaRow[i]) &&
				isSameItem(alphaRow[startSlot], alphaRow[i])
			) {
				span++;
			} else {
				break;
			}
		}
		return span;
	}

	return 1;
}

export function updateBannerTitle(currentSection) {
	const headerEl = document.querySelector('header.banner-header h1');
	const tableWrapper = document.querySelector('.table-wrapper');
	const secTh = document.querySelector('th.col-sec');

	const sec = (currentSection || '').toLowerCase();

	if (sec === 'alpha') {
		if (headerEl) headerEl.textContent = 'BCA 7th Semester - Alpha | Room 302';
		if (tableWrapper) tableWrapper.classList.add('single-section');
		if (secTh) secTh.style.display = 'none';
	} else if (sec === 'beta') {
		if (headerEl) headerEl.textContent = 'BCA 7th Semester - Beta | Room 302';
		if (tableWrapper) tableWrapper.classList.add('single-section');
		if (secTh) secTh.style.display = 'none';
	} else {
		if (headerEl) headerEl.textContent = 'BCA 7th Semester - Alpha & Beta | Room 302';
		if (tableWrapper) tableWrapper.classList.remove('single-section');
		if (secTh) secTh.style.display = '';
	}
}

function buildSundayRows(currentSection) {
	const sec = (currentSection || '').toLowerCase();
	const isSingle = sec === 'alpha' || sec === 'beta';
	const secCell = isSingle ? '' : `<td class="cell-sec">BOTH</td>`;
	return `<tr>
        <td class="cell-day">Sunday</td>
        ${secCell}
        <td colspan="9" class="cell-empty cell-holiday">HOLIDAY</td>
    </tr>`;
}

function buildDayRows(dayIndex, currentSection) {
	if (!scheduleData) return '';

	const alphaRow = scheduleData.alpha[dayIndex] || [];
	const betaRow = scheduleData.beta[dayIndex] || [];
	const dayName = DAYS[dayIndex];

	const sec = (currentSection || '').toLowerCase();

	// Single section views (alpha or beta)
	if (sec === 'alpha' || sec === 'beta') {
		const row = sec === 'alpha' ? alphaRow : betaRow;
		let html = `<tr data-day="${dayIndex}"><td class="cell-day">${dayName}</td>`;
		let slot = 0;
		while (slot < 9) {
			const span = countHorizontalSpan(row, slot);
			const info = getCellInfo(row[slot]);
			const attrProf = info.prof ? ` data-prof="${info.prof}"` : '';
			const colspanAttr = span > 1 ? ` colspan="${span}"` : '';
			html += `<td${colspanAttr} class="${info.css}"${attrProf}>${info.html}</td>`;
			slot += span;
		}
		html += `</tr>`;
		return html;
	}

	// SECTION.BOTH view: Always render separate ALPHA & BETA rows per day
	let tr1 = `<tr data-day="${dayIndex}"><td rowspan="2" class="cell-day">${dayName}</td><td class="cell-sec">ALPHA</td>`;
	let tr2 = `<tr data-day="${dayIndex}"><td class="cell-sec">BETA</td>`;

	let slot = 0;
	while (slot < 9) {
		const bothSpan = countMergedBothSpan(alphaRow, betaRow, slot);

		if (bothSpan > 0) {
			const info = getCellInfo(alphaRow[slot]);
			const attrProf = info.prof ? ` data-prof="${info.prof}"` : '';
			const colspanAttr = bothSpan > 1 ? ` colspan="${bothSpan}"` : '';
			tr1 += `<td${colspanAttr} rowspan="2" class="${info.css}"${attrProf}>${info.html}</td>`;
			slot += bothSpan;
		} else {
			const alphaInfo = getCellInfo(alphaRow[slot]);
			const betaInfo = getCellInfo(betaRow[slot]);

			const alphaProf = alphaInfo.prof ? ` data-prof="${alphaInfo.prof}"` : '';
			const betaProf = betaInfo.prof ? ` data-prof="${betaInfo.prof}"` : '';

			tr1 += `<td class="${alphaInfo.css}"${alphaProf}>${alphaInfo.html}</td>`;
			tr2 += `<td class="${betaInfo.css}"${betaProf}>${betaInfo.html}</td>`;

			slot += 1;
		}
	}

	tr1 += `</tr>`;
	tr2 += `</tr>`;

	return tr1 + tr2;
}

export function equalizeRowHeights() {
	const tbody = $('timetableBody') || document.getElementById('timetableBody');
	if (!tbody) return;
	const rows = Array.from(tbody.querySelectorAll('tr'));
	rows.forEach((r) => (r.style.height = 'auto'));

	let maxHeight = 36; // compact uniform row height
	rows.forEach((r) => {
		const h = r.getBoundingClientRect().height;
		if (h > maxHeight) maxHeight = Math.ceil(h);
	});

	if (maxHeight > 0) {
		rows.forEach((r) => (r.style.height = `${maxHeight}px`));
	}
}

export function renderSchedule(currentSection) {
	const tbody = $('timetableBody') || document.getElementById('timetableBody');
	if (!tbody) return;

	updateBannerTitle(currentSection);

	let html = '';

	for (let i = 1; i <= 6; i++) {
		html += buildDayRows(i, currentSection);
	}

	html += buildSundayRows(currentSection);

	tbody.innerHTML = html;
	highlightCurrentClass();
	setTimeout(equalizeRowHeights, 0);
}
