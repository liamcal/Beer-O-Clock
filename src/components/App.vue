<template>
	<div id="app">
		<canvas id="yeast"></canvas>
		<h1>Beer O'Clock</h1>

		<div id="beer">
			<div class="mug">
				<div class="beer-b"></div>
				<div class="liquid" v-bind:style="{ height: lqh + 'vmin' }">
					<div class="beer" v-bind:class="{ filled: filled, carbonate: carbonate }">
						<div class="foam"></div>
					</div>
				</div>
			</div>
			<div class="froth bubble" v-bind:class="{ flow: flow }"></div>
			<div class="froth small-bubbles" v-bind:class="{ flow: flow }"></div>
			<div class="froth drip" v-bind:class="{ flow: flow }"></div>
		</div>

		<div id="timer" v-if="!beerOClockActive"><span class="digit">{{ days }}</span><span class="sep">:</span><span class="digit">{{ hours }}</span><span class="sep">:</span><span class="digit">{{ minutes }}</span><span class="sep">:</span><span class="digit">{{ seconds }}</span></div>
		<div id="timer" v-else class="flash"><span class="digit">00</span>:<span class="digit">00</span>:<span class="digit">00</span>:<span class="digit">00</span></div>
		<div id="helper">dd:hh:mm:ss</div>
	</div>
</template>

<style src="@/assets/main.styl" lang="stylus"></style>

<script>

import fireworks from '@/components/fireworks';

const p = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
export default {
	name: 'index',
	mounted() {
		setInterval(() => {
			this.beerOClockActive = (this.nextFriday() - this.now.getTime()) <= 3600000;
			this.now = this.currentTime();
			if (!this.beerOClockActive) {
				document.title = `${this.days}:${this.hours}:${this.minutes}:${this.seconds} - Beer O'Clock`;
			} else {
				document.title = 'Beer O\'Clock';
			}
		}, 1000);
		setTimeout(() => {
			this.filled = true;
		}, 1500);
	},
	data() {
		return {
			filled: false,
			carbonate: false,
			flow: false,
			lqh: 0,
			time: {
				days: 0,
				hrs: 0,
				mins: 0,
				secs: 0
			},
			now: this.currentTime(),
			maxH: 30,
			beerOClockActive: false
		};
	},
	computed: {
		ttb() {
			if (this.now.getDay() == 5 && this.now.getHours() < 17) {
				this.lqh = this.maxH;
				setTimeout(() => {
					this.carbonate = true;
					this.flow = true;
				}, 800);
			} else {
				this.lqh = ((this.perc > 0.075 ? this.perc : 0.075) * this.maxH);
				this.flow = false;
				this.carbonate = false;
			}

			console.log(fireworks);

			if (this.beerOClockActive) {
				console.log(fireworks);
				this.lqh = this.maxH;
			}

			return (this.nextFriday() - this.now.getTime());
		},
		perc() {
			return 1 - Math.abs(this.now.getTime() - (this.nextFriday() - 604800)) / Math.abs(((this.nextFriday() - 604800) - this.nextFriday())) / 1000;
		},
		seconds() {
			var s = String('0' + (Math.floor((this.ttb % p.m) / p.s))).slice(-2);
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
	methods: {
		currentTime() {
			var t = new Date();
			t.setHours(16);
			t.setMinutes(0);
			return new Date(t);
		},
		nextFriday() {
			let date = new Date(this.now);
			date.setDate(date.getDate() + (12 - date.getDay()) % 7);
			date.setHours(16, 0, 0, 0);
			if (this.now.getDay() == 5 && this.now.getHours() >= 17) {
				date.setDate(date.getDate() + 7);
			}
			return date.getTime();
		},
		yeastify() {
			console.log('yeaaast');
		}
	}
};
</script>