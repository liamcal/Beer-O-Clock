<template>
	<div id="app">
		<h1>Beer O'Clock</h1>

		<div id="beer">
			<div class="mug">
				<div class="beer-b"></div>
				<div class="liquid" v-bind:style="{ height: lqh + 'vmin' }">
					<div class="beer" v-bind:class="{ filled: filled, carbonate: carbonate }">
						<div class="cap"></div>
					</div>
				</div>
			</div>
			<div class="froth bubble" v-bind:class="{ flow: flow }"></div>
			<div class="froth small-bubbles" v-bind:class="{ flow: flow }"></div>
			<div class="froth drip" v-bind:class="{ flow: flow }"></div>
		</div>

		<div id="timer"><span>{{ days }}</span>:<span>{{ hours }}</span>:<span>{{ minutes }}</span>:<span>{{ seconds }}</span></div>
	</div>
</template>

<style src="@/assets/main.styl" lang="stylus"></style>

<script>
const p = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
export default {
	name: 'index',
	mounted() {
		window.setInterval(() => {
			this.now = this.currentTime();
			document.title = `${this.days}:${this.hours}:${this.minutes}:${this.seconds} - Beer O'Clock`;
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
			au: new Audio('./static/final_countdown.mp3')
		};
	},
	computed: {
		ttb() {
			if (this.nextFriday() - this.now.getTime() <= 254000 && this.au.paused) {
				this.au.currentTime = ((this.nextFriday() - this.now.getTime()) / 1000);
				this.au.play();
			}
			if (this.now.getDay() == 5 && this.now.getHours() < 17) {
				this.lqh = 28;
				this.carbonate = true;
				this.flow = true;
			} else {
				this.lqh = ((this.perc > 0.075 ? this.perc : 0.075) * 28);
				this.flow = false;
				this.carbonate = false;
			}
			return (this.nextFriday() - this.now.getTime());
		},
		perc() {
			return 1 - Math.abs(this.now.getTime() - (this.nextFriday() - 604800)) / Math.abs(((this.nextFriday() - 604800) - this.nextFriday())) / 1000;
		},
		seconds() {
			return String('0' + (Math.floor((this.ttb % p.m) / p.s))).slice(-2);
		},
		minutes() {
			return String('0' + (Math.floor((this.ttb % p.h) / p.m))).slice(-2);
		},
		hours() {
			return String('0' + (Math.floor((this.ttb % p.d) / p.h))).slice(-2);
		},
		days() {
			return String('0' + (Math.floor(this.ttb / p.d))).slice(-2);
		}
	},
	methods: {
		currentTime() {
			return new Date();
		},
		nextFriday() {
			let date = new Date(this.now);
			date.setDate(date.getDate() + (12 - date.getDay()) % 7);
			date.setHours(16, 0, 0, 0);
			if (this.now.getDay() == 5 && this.now.getHours() >= 16) {
				date.setDate(date.getDate() + 7);
			}
			return date.getTime();
		}
	}
};
</script>