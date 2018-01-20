import anime from 'animejs';

var canvasEl = document.querySelector('#yeast');
var ctx = canvasEl.getContext('2d');

var numberOfParticules = 40;
var colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
var ptInterval = null;

function setCanvasSize() {
	canvasEl.width = window.innerWidth * 2;
	canvasEl.height = window.innerHeight * 2;
	canvasEl.style.width = window.innerWidth + 'px';
	canvasEl.style.height = window.innerHeight + 'px';
	canvasEl.getContext('2d').scale(2, 2);
}

function setParticuleDirection(p) {
	var angle = anime.random(0, 360) * Math.PI / 180;
	var value = anime.random(20, 180);
	var radius = [-1, 1][anime.random(0, 1)] * value;
	return {
		x: p.x + radius * Math.cos(angle),
		y: p.y + radius * Math.sin(angle)
	};
}

function createParticule(x,y) {
	var p = {};
	p.x = x;
	p.y = y;
	p.color = colors[anime.random(0, colors.length - 1)];
	p.radius = anime.random(16, 32);
	p.endPos = setParticuleDirection(p);
	p.draw = function() {
		ctx.beginPath();
		ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
		ctx.fillStyle = p.color;
		ctx.fill();
	};
	return p;
}

function renderParticule(anim) {
	for (var i = 0; i < anim.animatables.length; i++) {
		anim.animatables[i].target.draw();
	}
}

function animateParticules(x, y) {
	var particules = [];
	for (var i = 0; i < numberOfParticules; i++) {
		particules.push(createParticule(x, y));
	}
	anime.timeline().add({
		targets: particules,
		x: function(p) { return p.endPos.x; },
		y: function(p) { return p.endPos.y; },
		radius: 0.1,
		duration: anime.random(1200, 1800),
		easing: 'easeOutExpo',
		update: renderParticule
	});
}

var getOp = (z) => {
	var [ a, b ] = [ canvasEl.width, canvasEl.height ];
	return [(a - z[0]) / 2, z[1]];
};

var getPt = () => {
	var [ a, b ] = [canvasEl.width / 2, canvasEl.height / 2];
	var x = anime.random(0, a / 4);
	var y = anime.random(50, b - 50);
	return [ x, y ];
};

var getPtx = () => {
	var a = canvasEl.width / 2;
	var x = anime.random(a / 5, a - (a / 5));
	return x;
};

var render;

window.addEventListener('resize', setCanvasSize, false);


export default {
	start: () => {
		render = anime({
			duration: Infinity,
			update: function() {
				ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
			}
		});
		setCanvasSize();
		ptInterval = setInterval(() => {
			for (var i=0; i<=3; i++) {
				setTimeout(() => {
					animateParticules(...getOp(getPt()));
				}, anime.random(0, 280));

				setTimeout(() => {
					animateParticules(...getPt());
				}, anime.random(0, 280));
			}

			setTimeout(() => {
				animateParticules(getPtx(), 30);
			}, anime.random(0, 280));
			setTimeout(() => {
				animateParticules(getPtx(), (canvasEl.height/2) - 30);
			}, anime.random(0, 280));
		}, 500);
	},
	stop: () => {
		render = undefined;
		clearInterval(ptInterval);
	}
};