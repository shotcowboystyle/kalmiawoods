import type { StringObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class BackgroundShapeAnimation {
	DOM: StringObject;
	modules: NodeListOf<SVGMarkerElement>;

	constructor() {
		this.DOM = {
			module: '.js-bg-shape-animation-module',
			svg: '.js-bg-shape-animation-svg',
		};
		this.modules = document.querySelectorAll(this.DOM.module);
	}

	init() {
		if (this.modules.length) {
			this.modules.forEach(($el) => {
				this.setup($el);
			});
		}
	}

	setup($moduleEl: SVGMarkerElement) {
		const $svgEl = $moduleEl.querySelector<SVGMarkerElement>(this.DOM.svg);
		const $linearGradientEl = $moduleEl && $moduleEl.querySelector('linearGradient');
		const $viewBoxWidth = $svgEl?.viewBox.baseVal.width ?? 0;

		if ($svgEl && $linearGradientEl && $linearGradientEl) {
			gsap.fromTo(
				$linearGradientEl,
				{
					attr: {
						x2: 0,
					},
				},
				{
					attr: {
						x2: $viewBoxWidth,
					},
					scrollTrigger: {
						trigger: $svgEl,
						scrub: 1,
					},
				},
			);
		}
	}
}
