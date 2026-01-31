/**
 * @fileoverview Print Mode Logic
 * @description Handles print functionality including button initialization
 *              and print mode styling hooks.
 * @module features/print/printMode
 * @version 2.0.0
 */

/**
 * Trigger the browser's print dialog
 */
export function printPage() {
    window.print();
}

/**
 * Enable print mode styling on body
 * Sets data-mode="print" attribute for CSS targeting.
 */
export function enablePrintMode() {
    document.body.dataset.mode = 'print';
}

/**
 * Disable print mode styling
 * Removes data-mode attribute from body.
 */
export function disablePrintMode() {
    delete document.body.dataset.mode;
}

/**
 * Initialize print button event listener
 * Attaches click handler to .print-btn element.
 * Note: Replaces inline onclick to prevent double-triggering.
 */
export function initPrintButton() {
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', printPage);
    }
}
