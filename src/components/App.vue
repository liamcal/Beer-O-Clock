<template>
	<div id="app">
		<h1>Beer O'Clock</h1>
		<div id="beer">
			<div class="mug">
				<div class="beer-b"></div>
				<div class="liquid" v-bind:style="{ height: knmi ? 100 + 'vmin' : liquidHeight + 'vmin' }">
					<div class="beer" v-bind:class="{ filled: knmi ? true : filled, carbonate: knmi ? true : carbonate }">
						<div class="foam"></div>
					</div>
				</div>
			</div>
			<div class="froth bubble" v-bind:class="{ flow: knmi ? true : flow }"></div>
			<div class="froth drip" v-bind:class="{ flow: knmi ? true : flow }"></div>
		</div>

		<div id="timer" v-if="!itIsBeerOClock && !knmi">
			<span class="digit">{{ days }}</span><span class="sep">:</span><span class="digit">{{ hours }}</span><span class="sep">:</span><span class="digit">{{ minutes }}</span><span class="sep">:</span><span class="digit">{{ seconds }}</span>
		</div>
		<div id="timer" v-else-if="knmi"><span class="digit">{{dv}}</span>:<span class="digit">{{hv}}</span>:<span class="digit">{{mv}}</span>:<span class="digit">{{sv}}</span>
		</div>
		<div id="timer" v-else class="flash"><span class="digit">00</span>:<span class="digit">00</span>:<span class="digit">00</span>:<span class="digit">00</span>
		</div>
		<div id="helper">dd:hh:mm:ss</div>
	</div>
</template>

<style src="@/assets/main.styl" lang="stylus"></style>

<script>

import fireworks from '@/assets/fireworks.js';

import randomColor from 'randomcolor';

window.DEBUG = false;

const p = { s: 1, m: 60, h: 60 * 60, d: 24 * 60 * 60 };
var fT = new Date().getTime();

export default {
	name: 'index',
	mounted() {
		if (this.itIsBeerOClock) {
			fireworks.start();
		}

		setInterval(() => {
			this.now = this.currentTime();
		}, 1000);

		setTimeout(() => {
			this.filled = true;
		}, 1600);

		const konami = (callback) => {
			let kkeys = [];
			// up,up,down,down,left,right,left,right,B,A
			const knmi = '38,38,40,40,37,39,37,39,66,65';
			return event => {
				kkeys.push(event.keyCode);
				if (kkeys.toString().indexOf(knmi) >= 0) {
					callback();
					kkeys = [];
				}
			};
		};

		const handler = konami(() => {
			if (this.knmi) {
				return;
			}
			this.knmi = true;

			this.filled = true;
			let y = document.querySelectorAll('p,span,#helper,h1');
			let x = setInterval(() => {
				let v = [
					String('0' + (Math.floor(Math.random() * 100))).slice(-2),
					String('0' + (Math.floor(Math.random() * 100))).slice(-2),
					String('0' + (Math.floor(Math.random() * 100))).slice(-2),
					String('0' + (Math.floor(Math.random() * 100))).slice(-2)
				];
				[this.dv, this.hv, this.mv, this.sv] = v;
				let r = randomColor({ count: y.length, luminosity: 'light' });
				r.map((z, i) => {
					y[i].style.color = z;
				});
			}, 125);

			setTimeout(() => {
				clearInterval(x);
				y.forEach(z => {
					z.style.color = 'inherit';
				});
				this.knmi = false;
			}, 1000*10);
		});

		window.addEventListener('keydown', handler);
	},
	data() {
		return {
			now: this.currentTime(),
			filled: false,
			carbonate: false,
			flow: false,
			liquidHeight: 0,
			maxH: 30,
			knmi: false,
			dv: '',
			hv: '',
			mv: '',
			sv: ''
		};
	},
	computed: {
		itIsBeerOClock() {
			if (this.now.getHours() == 16 && this.now.getDay() == 5 && this.now.getMinutes() == 30) {
				return (this.nextFriday() - this.now.getTime()) <= 3600000;
			}
		},
		ttb() {
			return ((this.nextFriday() - this.now.getTime()) / 1000).toFixed(0);
		},
		perc() {
			return (1 - Math.abs(this.now.getTime() - (this.nextFriday() - 604800)) / Math.abs(((this.nextFriday() - 604800) - this.nextFriday())) / 1000).toFixed(3);
		},
		seconds() {
			var s = String('0' + (Math.floor(this.ttb % p.m))).slice(-2);
			return s > 0 ? s : '00';
		},
		minutes() {
			var m = String('0' + (Math.floor((this.ttb % p.h) / p.m))).slice(-2);
			return m > 0 ? m : '00';
		},
		hours() {
			var h = String('0' + (Math.floor((this.ttb % p.d) / p.h))).slice(-2);
			return h > 0 ? h : '00';
		},
		days() {
			var d = String('0' + (Math.floor(this.ttb / p.d))).slice(-2);
			return d > 0 ? d : '00';
		}
	},
	watch: {
		itIsBeerOClock: function() {
			if (this.itIsBeerOClock) {
				fireworks.start();
			} else {
				fireworks.stop();
			}
		},
		knmi: function() {
			if (this.knmi) {
				fireworks.start();
			} else {
				fireworks.stop();
			}
		},
		now: function() {
			if (!this.itIsBeerOClock) {
				document.title = `${this.days}:${this.hours}:${this.minutes}:${this.seconds} - Beer O'Clock`;
			} else {
				document.title = 'Beer O\'Clock';
			}

			if (this.now.getDay() == 5 && this.now.getHours() < 17) {
				this.liquidHeight = this.maxH;
				setTimeout(() => {
					this.carbonate = true;
					this.flow = true;
				}, 800);
			} else {
				this.liquidHeight = ((this.perc > 0.075 ? this.perc : 0.075) * this.maxH);
				this.flow = false;
				this.carbonate = false;
			}

			if (this.itIsBeerOClock) {
				this.liquidHeight = this.maxH;
			}
		}
	},
	methods: {
		currentTime() {
			if (window.DEBUG) {
				return new Date(this.nextFriday());
			} else {
				return new Date();
			}
		},
		nextFriday() {
			let date = new Date(this.now);
			date.setDate(date.getDate() + (12 - date.getDay()) % 7);
			date.setHours(16, 30, 0, 0);
			if (this.now.getDay() == 5 && this.now.getHours() >= 17) {
				date.setDate(date.getDate() + 7);
			}
			return date.getTime();
		}
	}
};
</script>
