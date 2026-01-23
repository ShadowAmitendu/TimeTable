function toggleProf(profId, btn) {
	const subjectCells = document.querySelectorAll(
		"td:not(.day):not(.break):not(.holiday):not(.no-classes)",
	);
	const tabs = document.querySelectorAll(".prof-tab");
	const isActive = btn.classList.contains("active");

	tabs.forEach((t) => t.classList.remove("active"));
	subjectCells.forEach((cell) =>
		cell.classList.remove("dimmed", "highlight-active"),
	);

	if (!isActive) {
		document.body.classList.add("filter-active");
		btn.classList.add("active");
		subjectCells.forEach((cell) => {
			if (cell.dataset.prof === profId) {
				cell.classList.add("highlight-active");
			} else {
				cell.classList.add("dimmed");
			}
		});
	} else {
		document.body.classList.remove("filter-active");
	}
}

function highlightCurrentClass() {
	const now = new Date();
	const currentDay = now.getDay();
	const currentTime = now.getHours() * 60 + now.getMinutes();
	const rows = document.querySelectorAll("tbody tr");
	const headers = document.querySelectorAll("thead th");

	// Clear all current-class markers first
	document
		.querySelectorAll(".current-class")
		.forEach((el) => el.classList.remove("current-class"));

	rows.forEach((row) => {
		const rowDay = parseInt(row.dataset.day);
		if (rowDay === currentDay) {
			const cells = row.querySelectorAll("td");
			headers.forEach((th, index) => {
				if (index === 0 || !th.dataset.start) return;
				const [startH, startM] = th.dataset.start.split(":").map(Number);
				const [endH, endM] = th.dataset.end.split(":").map(Number);
				const startTime = startH * 60 + startM;
				const endTime = endH * 60 + endM;

				if (currentTime >= startTime && currentTime < endTime) {
					cells[index].classList.add("current-class");
				}
			});
		}
	});
}

setInterval(highlightCurrentClass, 30000);
highlightCurrentClass();


