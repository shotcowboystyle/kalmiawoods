import type { GenericObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class CtaImageAnimation {
	DOM: GenericObject;
	sections: NodeList;

	constructor($el: HTMLElement | null) {
		this.DOM = {
			section: '.js-cta-section-b',
			imageLeft: '.js-cta-section-b-image-left',
			imageRight: '.js-cta-section-b-image-right',
			content: '.js-cta-section-content',
			states: {
				isActive: 'is-active',
			},
		};

		this.sections = $el.querySelectorAll(this.DOM.section);
	}

	init() {
		if (this.sections.length) {
			this.sections.forEach(($sectionEl) => {
				this.animate($sectionEl as HTMLElement);
			});
		}
	}

	animate($sectionEl: HTMLElement) {
		const $imageLeftEl = $sectionEl.querySelector(this.DOM.imageLeft);
		const $imageRightEl = $sectionEl.querySelector(this.DOM.imageRight);
		const $contentEl = $sectionEl.querySelector(this.DOM.content);
		const isMobile = window.innerWidth <= 800;

		gsap
			.timeline({
				scrollTrigger: {
					trigger: $sectionEl,
					scrub: 1,
					start: 'top 80%',
					end: 'bottom 80%',
				},
			})
			.from($imageLeftEl, {
				xPercent: isMobile ? 300 : (5 / 6) * 100,
				duration: 1,
			})
			.from(
				$imageRightEl,
				{
					xPercent: isMobile ? -300 : (-5 / 6) * 100,
					duration: 1,
				},
				'-=1',
			)
			.from(
				$contentEl,
				{
					opacity: 0,
				},
				'-=0.4',
			);
	}
}
