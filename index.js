function getCurrentTime() {
	let ct = new Date();
	return ct;
}

function nextFriday() {
	var ct = getCurrentTime();
	var dayOfWeek = 5;
	var date = new Date();
	date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
	date.setHours(16, 0, 0, 0);
	if (ct.getDay() == 5 && ct.getHours() >= 16) {
		date.setDate(date.getDate() + 7);
	}
	return date.getTime();
}

function timeToBeer(a) {
	return Math.abs(getCurrentTime().getTime() - a);
}

function stringTime(t) {
	var ct = getCurrentTime();
	var dyst = 0;
	var x = [5, 4, 3, 2, 1, 0, 6];
	if (ct.getHours() >= 16 && ct.getDay() == 5) {
		dyst = 7;
	} else {
		dyst = x[ct.getDay()]
	}
	return `${dyst}:${new Date(t).toISOString().slice(-13, -5)}`;
}

function addHtml(t) {
	document.title = t;
	setTimeout(() => {
		document.getElementById('timer').innerHTML = t;
	}, 150)
}

setInterval(() => {
	addHtml(stringTime(timeToBeer(nextFriday())));
}, 200);