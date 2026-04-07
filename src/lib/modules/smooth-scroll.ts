import type { StringObject } from '@/types/common';
import { easeOutExpo } from '@/utils/easings';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class SmoothScroll extends Lenis {
	DOM: StringObject;
	isActive: boolean;
	callbacks: (() => void)[];

	constructor() {
		super({
			duration: 1.8,
			smoothWheel: true,
			easing: easeOutExpo,
			orientation: 'vertical',
			smoothTouch: false,
			touchMultiplier: 2,
		});

		this.DOM = {
			wrapper: '.js-smooth-wrapper',
			content: '.js-smooth-content',
		};

		this.isActive = true;
		this.callbacks = [];
	}

	init() {
		const raf = (time: number) => {
			this.raf(time);
			requestAnimationFrame(raf);
		};
		requestAnimationFrame(raf);

		this.on('scroll', () => {
			ScrollTrigger.update();
			this.callbackRaf();
		});

		gsap.ticker.add((time: number) => {
			this.raf(1e3 * time);
		});

		gsap.ticker.lagSmoothing(0);

		document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach(($linkEl) => {
			if ($linkEl.hash && $linkEl.hash !== '') {
				$linkEl.addEventListener('click', (event: Event) => {
					event.preventDefault();
					this.to($linkEl.hash);
				});
			}
		});
	}

	scrollLock() {
		this.stop();
	}

	unlockScroll() {
		this.start();
	}

	kill() {
		this.destroy();
	}

	to($target: string) {
		this.scrollTo($target, {
			offset: -100,
			duration: 2,
			easing: easeOutExpo,
			immediate: false,
		});
	}

	scrollZero() {
		setTimeout(() => this.scrollTo(0, { immediate: true }), 5);
	}

	resize() {}

	render(time?: number) {
		if (!this.isActive) {
			return;
		}

		this.raf(time);
	}

	set active(value: boolean) {
		this.isActive = value;
	}

	callbackRaf() {
		// call this in scroll method
		this.callbacks.forEach((cb) => cb());
	}

	subscribe(callback: () => unknown) {
		this.callbacks.push(callback);
	}

	unsubscribe(callback: () => unknown) {
		this.callbacks = this.callbacks.filter((cb) => cb !== callback);
	}

	unsubscribeAll() {
		this.callbacks = [];
	}
}
