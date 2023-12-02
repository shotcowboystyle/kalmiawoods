import type { StringObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class ParallaxBackgroundAnimation {
	DOM: StringObject;

	constructor() {
		this.DOM = {
			wrapper: '.js-parallax-wrapper',
			item: '.js-parallax-item',
		};
	}

	init(...args: any) {
		// const e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : document;
		const e = 0 < args.length && void 0 !== args[0] ? args[0] : document;
		const wrappers: NodeListOf<HTMLElement> = e.querySelectorAll(this.DOM.wrapper);
		if (wrappers.length) {
			wrappers.forEach(($wrapperEl: HTMLElement) => {
				this.setup($wrapperEl);
			});
		}
	}

	setup($element: HTMLElement) {
		const parallaxItem = $element.querySelector(this.DOM.item);

		null !== parallaxItem &&
			gsap.from(parallaxItem, {
				yPercent: -20,
				overwrite: true,
				scrollTrigger: {
					trigger: $element,
					start: 'top bottom',
					end: 'bottom top',
					scrub: 0.1,
				},
			});
	}
}
