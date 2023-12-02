import type { StringObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class SectionSeparatorsAnimation {
	DOM: StringObject;
	separator: NodeListOf<HTMLElement>;

	constructor() {
		this.DOM = {
			separator: '.js-section-separator',
			main: '.js-section-separator-main',
			secondary: '.js-section-separator-secondary',
		};
		this.separator = document.querySelectorAll(this.DOM.separator);
	}

	init() {
		setTimeout(() => {
			if (this.separator.length) {
				this.separator.forEach(($separatorWrapperEl) => {
					this.setup($separatorWrapperEl);
				});
			}
		}, 500);
	}

	setup($separatorWrapperEl: HTMLElement) {
		const mainSeparatorEl = $separatorWrapperEl.querySelector(this.DOM.main);
		const secondarySeparatorEl = $separatorWrapperEl.querySelector(this.DOM.secondary);

		gsap.to(mainSeparatorEl, {
			x: -window.innerHeight / 1.5,
			scrollTrigger: {
				trigger: $separatorWrapperEl,
				start: 'top bottom',
				end: 'bottom top',
				scrub: 1,
			},
		});

		gsap.to(secondarySeparatorEl, {
			x: -window.innerHeight / 3,
			scrollTrigger: {
				trigger: $separatorWrapperEl,
				start: 'top bottom',
				end: 'bottom top',
				scrub: 1,
			},
		});
	}
}
