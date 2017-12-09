const currentTime = () => {
	return new Date();
}

const getCurrentTime = currentTime;

const nextFriday = () => {
	let date = new Date(currentTime());
	date.setDate(date.getDate() + (12 - date.getDay()) % 7);
	date.setHours(16, 0, 0, 0);
	if (currentTime().getDay() == 5 && currentTime().getHours() >= 16) {
		date.setDate(date.getDate() + 7);
	}
	return date.getTime();
}

function timeToBeer() {
	var perc = 1 - Math.abs(currentTime().getTime() - (nextFriday() - 604800)) / Math.abs(((nextFriday() - 604800) - nextFriday())) / 1000;
	setTimeout(() => {
		document.getElementsByClassName('beer')[0].classList.add('filled');
	}, 300);
	document.getElementsByClassName('liquid')[0].style.height = perc * 28 + 'vmin';
	if ((((nextFriday()) - currentTime().getTime()) / 1000) < 254 && document.getElementById('countdown_song').paused) {
		document.getElementById('countdown_song').currentTime = 254 - ((nextFriday() - getCurrentTime().getTime()) / 1000);
		document.getElementById('countdown_song').play();
	}
	if (currentTime().getDay() == 5 && currentTime().getHours() < 17) {
		document.getElementsByClassName('liquid')[0].style.height = 28 + 'vmin';
		document.getElementsByClassName('beer')[0].classList.add('carbonate');
		for (var i = document.getElementsByClassName('froth').length - 1; i >= 0; i--) {
			document.getElementsByClassName('froth')[i].classList.add('flow');
		}
	} else {
		for (var i = document.getElementsByClassName('froth').length - 1; i >= 0; i--) {
			document.getElementsByClassName('froth')[i].classList.remove('flow');
		}
		document.getElementsByClassName('beer')[0].classList.remove('carbonate');
	}
	return (nextFriday() - getCurrentTime().getTime());
}

function stringTime() {
	var t = timeToBeer();
	var ct = getCurrentTime();
	var dyst = 0;
	var x = [5, 4, 3, 2, 1, 0, 6];
	if (ct.getHours() >= 16 && ct.getDay() == 5) {
		dyst = 6;
	} else {
		dyst = x[ct.getDay()];
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