let currentTime = () => {
	let d = new Date();
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

const stringTime = () => {
	var dyst = 0;
	var x = [5, 4, 3, 2, 1, 0, 6];
	if (currentTime().getHours() >= 16 && currentTime().getDay() == 5) {
		dyst = 6;
	} else {
		dyst = x[currentTime().getDay()];
	}
	if (!customTimes()) {
		document.getElementById('helper').style.display = 'block';
		changeTitle(`${dyst}:${new Date(timeToBeer()).toISOString().slice(-13, -5)}`)
		return `<span>0${dyst}</span><span>${new Date(timeToBeer()).toISOString().slice(-13, -5).split(':').join('</span><span>')}</span>`;
	} else {
		document.getElementById('helper').style.display = 'none';
		changeTitle(`${customTimes()}`)
		return `<span>${customTimes()}</span>`;
	}
}

const changeTitle = (title) => {
	document.title = title;
}

const addHtml = (t) => {
	document.getElementById('timer').innerHTML = t;
}

(() => {
	setInterval(() => {
		addHtml(stringTime());
	}, 1000);
})();

const customTimes = () => {
	if (currentTime().getHours() == 16 && currentTime().getDay()) {
		return 'Beer O\'Clock';
	}
	return null;
}