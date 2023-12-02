import type { StringObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class HeaderLoad {
	DOM: StringObject;

	constructor() {
		this.DOM = {
			header: '.js-header',
			image: '.js-header-image',
			imageInner: '.js-header-image-inner',
		};
	}

	animation1: gsap.core.Animation | null = null;
	animation2: gsap.core.Animation | null = null;

	init() {
		setTimeout(() => {
			const headers = document.querySelectorAll<HTMLElement>(this.DOM.header);
			if (headers.length) {
				headers.forEach(($headerEl: HTMLElement) => {
					this.setup($headerEl);
				});
			}
		}, 100);
	}

	setup($headerEl: HTMLElement) {
		const $imageEl = $headerEl.querySelector<HTMLElement>(this.DOM.image);
		const $imageInnerEl = $headerEl.querySelector<HTMLElement>(this.DOM.imageInner);
		const $imagePictureEl = $headerEl.querySelector<HTMLElement>('picture');

		if ($imageEl && $imagePictureEl && $imageInnerEl) {
			const scrollEnd = $imageEl.offsetHeight;

			gsap.set('html', {
				'--scale-value': 0.27,
			});

			this.animation1 = gsap.to('html', {
				scrollTrigger: {
					trigger: $imageEl,
					scrub: true,
					start: 'center 40%',
					end: scrollEnd,
				},
				'--scale-value': 1,
			});

			this.animation2 = gsap.to($imageEl, {
				scrollTrigger: {
					trigger: $imageEl,
					start: 'center center',
					end: scrollEnd,
					scrub: true,
					pin: true,
				},
			});
		}
	}

	kill() {
		if (this.animation1 && this.animation2) {
			this.animation1.kill();
			this.animation2.kill();
		}
	}
}
