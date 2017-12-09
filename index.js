let currentTime = () => {
	let d = new Date();
	d.setDate(8);
	d.setHours(15, 57)
	return new Date(d);
}

const nextFriday = () => {
	let date = new Date(currentTime());
	date.setDate(date.getDate() + (12 - date.getDay()) % 7);
	date.setHours(16, 0, 0, 0);
	if (currentTime().getDay() == 5 && currentTime().getHours() >= 16) {
		date.setDate(date.getDate() + 7);
	}
	return date.getTime();
}

const timeToBeer = () => {
	var perc = 1 - Math.abs(currentTime().getTime() - (nextFriday() - 604800)) / Math.abs(((nextFriday() - 604800) - nextFriday())) / 1000;
	setTimeout(() => {
		document.getElementsByClassName('beer')[0].classList.add('filled');
	}, 300);

	document.getElementsByClassName('liquid')[0].style.height = ((perc > 0.075 ? perc : 0.075) * 28) + 'vmin';
	if ((((nextFriday()) - currentTime().getTime()) / 1000) < 254 && document.getElementById('countdown_song').paused) {
		document.getElementById('countdown_song').currentTime = 254 - ((nextFriday() - currentTime().getTime()) / 1000);
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
	return (nextFriday() - currentTime().getTime());
}

const timer = () => {
	let _second = 1000;
	let _minute = _second * 60;
	let _hour = _minute * 60;
	let _day = _hour * 24;

	let distance = timeToBeer();

	let rem = {
		days: Math.floor(distance / _day),
		hours: Math.floor((distance % _day) / _hour),
		minutes: Math.floor((distance % _hour) / _minute),
		seconds: Math.floor((distance % _minute) / _second)
	};

	Object.keys(rem).map((k) => {
		rem[k] = String('0' + rem[k]).slice(-2);
	});

	changeTitle(`${rem.days}:${rem.hours}:${rem.minutes}:${rem.seconds} - Beer O'Clock`)
	const y = ['d', 'h', 'm', 's'];
	if (currentTime().getDay() == 5 && currentTime().getHours() == 16) {
		document.getElementById('timer').innerHTML = '<span class="d">00</span>:<span class="h">00</span>:<span class="m">00</span>:<span class="s">00</span>';
	} else {
		for (var i=0; i < y.length; i++) {
			document.querySelectorAll('#timer span.' + y[i])[0].innerHTML = Object.values(rem)[i];
		}
	}
}

const changeTitle = (title) => {
	document.title = title;
}

(() => {
	setInterval(() => {
		timer();
	}, 1000);
})();

const customTimes = () => {
	if (currentTime().getHours() == 16 && currentTime().getDay()) {
		return 'Beer O\'Clock';
	}
	return null;
}