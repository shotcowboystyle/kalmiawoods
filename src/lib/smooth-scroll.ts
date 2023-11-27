import type { StringObject } from '@/types/common';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class SmoothScroll {
	DOM: StringObject;

	constructor() {
		this.DOM = {
			wrapper: '.js-smooth-wrapper',
			content: '.js-smooth-content',
		};
	}

	lenis: Lenis | null = null;

	init() {
		this.lenis = new Lenis();

		const raf = (time: number) => {
			if (this.lenis) {
				this.lenis.raf(time);
			}
			requestAnimationFrame(raf);
		};
		requestAnimationFrame(raf);

		this.lenis.on('scroll', ScrollTrigger.update);

		gsap.ticker.add((time: number) => {
			this.lenis?.raf(1e3 * time);
		});

		document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach(($linkEl) => {
			if ($linkEl.hash && $linkEl.hash !== '') {
				$linkEl.addEventListener('click', (event: Event) => {
					event.preventDefault();
					this.scrollTo($linkEl.hash);
				});
			}
		});
	}

	scrollLock() {
		if (this.lenis) {
			this.lenis.stop();
		}
	}

	unlockScroll() {
		if (this.lenis) {
			this.lenis.start();
		}
	}

	kill() {
		if (this.lenis) {
			this.lenis.destroy();
		}
	}

	scrollTo($scrollEl: string) {
		if (this.lenis) {
			this.lenis.scrollTo($scrollEl, {
				offset: -100,
				duration: 2,
			});
		}
	}
}
