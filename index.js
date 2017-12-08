function nextFriday() {
	var dayOfWeek = 5;
	var date = new Date();
	date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
	date.setHours(16, 0, 0, 0);
	return date.getTime();
}

function timeToBeer() {
	return Math.abs(new Date().getTime() - nextFriday());
}

function stringTime(t) {
	return new Date(t).toISOString().slice(-13, -5);
}

function addHtml(t) {
	document.title = t;
	setTimeout(() => {
		document.getElementById('timer').innerHTML = t;
	}, 150)
}

setInterval(() => {
	addHtml(stringTime(timeToBeer()));
}, 100);