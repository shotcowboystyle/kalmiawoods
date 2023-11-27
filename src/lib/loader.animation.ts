import ShapeOverlays from '@/lib/shape-overlays';
import type { GenericObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class LoaderAnimation {
	DOM: GenericObject;
	loader: HTMLElement;
	afterLoader: Event;
	shapeOverlays: ShapeOverlays;

	constructor() {
		this.DOM = {
			loader: '.js-loader',
			// homeHeader: '.js-home-header',
			states: {
				scrollLockTop: 'scroll-lock-top',
			},
		};
		this.loader = document.querySelector(this.DOM.loader);
		this.afterLoader = new Event('afterLoader');
		this.shapeOverlays = new ShapeOverlays(this.loader);
	}

	showLoader(event?: Event) {
		this.shapeOverlays.toggle(event);
	}

	hideLoader() {
		this.shapeOverlays.toggle();
		// null == document.querySelector(this.DOM.homeHeader) &&
		// 	(document.body.classList.add(this.DOM.states.scrollLockTop),
		setTimeout(() => {
			document.body.classList.remove(this.DOM.states.scrollLockTop);
			setTimeout(() => {
				ScrollTrigger.refresh();
			}, 100);
		}, 100);
	}
}
