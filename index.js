var testingMode = false;

function getCurrentTime() {
	let ct = new Date();
	ct = fakeDate(ct);
	return ct;
}

function fakeDate(ct) {
	if (testingMode) {
		ct.setHours(15, 55);
		ct.setDate(15);
	}
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

function timeToBeer() {
	var perc = 1 - Math.round(Math.abs(nextFriday() - getCurrentTime().getTime()) / 687600) / 1000;
	if ((Math.abs(getCurrentTime().getTime() - nextFriday()) / 1000) < 254 && document.getElementById('countdown_song').paused) {
		document.getElementById('countdown_song').currentTime = 254 - (Math.abs(getCurrentTime().getTime() - nextFriday()) / 1000);
		document.getElementById('countdown_song').play();
	}
	document.getElementsByClassName('beer')[0].style.height = perc * 28 + 'vmin'
	if (perc >= 0.9) {
		document.getElementsByClassName('bubble')[0].style.opacity = 5*perc/6;
		document.getElementsByClassName('small-bubbles')[0].style.opacity = 5*perc/6;
		document.getElementsByClassName('drip')[0].style.opacity = 5*perc/6;
	} else {
		document.getElementsByClassName('bubble')[0].style.opacity = 0;
		document.getElementsByClassName('small-bubbles')[0].style.opacity = 0;
		document.getElementsByClassName('drip')[0].style.opacity = 0;
	}
	return Math.abs(getCurrentTime().getTime() - nextFriday());
}

function stringTime() {
	var t = timeToBeer();
	var ct = getCurrentTime();
	var dyst = 0;
	var x = [5, 4, 3, 2, 1, 0, 6];
	if (ct.getHours() >= 16 && ct.getDay() == 5) {
		dyst = 7;
	} else {
		dyst = x[ct.getDay()]
	}
	var text = customTimes();
	changeTitle(`${dyst}:${new Date(t).toISOString().slice(-13, -5)}`)
	if (text == null) {
		document.getElementById('helper').style.display = 'block';
		return `<span>0${dyst}</span><span>${new Date(t).toISOString().slice(-13, -5).split(':').join('</span><span>')}</span>`;
	} else {
		document.getElementById('helper').style.display = 'none';
		return `<span>${text}</span>`;
	}
}

function changeTitle(title) {
	document.title = title;
}

function addHtml(t) {
	document.getElementById('timer').innerHTML = t;
}

(function loopTheShitOutOfIt() {
	setInterval(() => {
		addHtml(stringTime());
	}, 1000);
})();

function customTimes() {
	var ct = getCurrentTime();
	if (ct.getHours() == 16) {
		if (ct.getMinutes() == 20) {
			return '420';
		} else if (ct.getDay() == 5) {
			return 'Beer O\'Clock';
		}
	}
	return null;
}