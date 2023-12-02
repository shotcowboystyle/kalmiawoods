import ShapeOverlays from '@/lib/modules/shape-overlays';
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
			homeHeader: '.js-home-header',
			states: {
				scrollLockTop: 'scroll-lock-top',
			},
		};
		this.loader = document.querySelector(this.DOM.loader);
		this.afterLoader = new Event('afterLoader');
		this.shapeOverlays = new ShapeOverlays(this.loader);
	}

	isAnimating = false;

	showLoader(cb?: any) {
		this.isAnimating = true;
		this.shapeOverlays?.toggle(cb);
	}

	hideLoader() {
		this.isAnimating = true;

		this.shapeOverlays?.toggle(() => {
			if (document.querySelector(this.DOM.homeHeader) == null) {
				document.body.classList.add(this.DOM.states.scrollLockTop);
			}
			this.done();
			// this.smoothScroll?.unlockScroll();
		});

		if (document.querySelector(this.DOM.homeHeader) == null) {
			document.body.classList.add(this.DOM.states.scrollLockTop);
		}

		setTimeout(() => {
			document.body.classList.remove(this.DOM.states.scrollLockTop);
			setTimeout(() => {
				ScrollTrigger.refresh();
			}, 100);
		}, 100);
	}

	done() {
		this.isAnimating = false;
	}
}
