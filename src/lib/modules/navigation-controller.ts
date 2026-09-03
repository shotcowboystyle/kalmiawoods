import ShapeOverlays from '@/lib/modules/shape-overlays';
import SmoothScroll from '@/lib/modules/smooth-scroll';
import type { GenericObject } from '@/types/common';
import { prefersReducedMotion } from '@/utils/motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

/**
 * "smart" navigation which goes off screen when scrolling down for a better overview of content and UX
 * navigation appears when scrolling up
 */
export default class NavigationController {
	DOM: GenericObject;
	scrolling: boolean;
	scrollNavigationOffset: number;
	previousTop: number;
	currentTop: number;
	scrollDelta: number;
	scrollOffset: number;
	navigation: HTMLElement;
	hamburgers: NodeListOf<HTMLElement>;
	mobileNavigation: HTMLElement;
	mobileNavigationInner: HTMLElement;
	mobileNavigationLogo: HTMLElement;
	mobileNavigationItems: NodeListOf<HTMLElement>;
	mobileNavigationItemWrapper: HTMLElement;
	overlay: HTMLElement;
	smoothScroll: SmoothScroll | null;

	constructor() {
		/**
		 * Navigation DOM selectors
		 * Navigation DOM state CSS classes
		 * @type {{navigation: string, states: {navigationSlideUp: string, navigationScrolled: string, navigationFixed: string}}}
		 */
		this.DOM = {
			navigation: '.js-navigation',
			hamburger: '.js-hamburger',
			overlay: '.js-mobile-navigation-overlay',
			mobileNavigation: '.js-mobile-navigation',
			mobileNavigationInner: '.js-mobile-navigation-inner',
			mobileNavigationLogo: '.js-mobile-navigation-logo',
			mobileNavigationItem: '.js-mobile-navigation-item',
			mobileNavigationItemWrapper: '.js-mobile-navigation-item-wrapper',
			states: {
				navigationScrolled: 'has-scrolled',
				navigationFixed: 'is-fixed',
				navigationSlideUp: 'slide-up',
				active: 'is-active',
			},
		};

		/**
		 * flag, state variable for scrolling event
		 * @type {boolean}
		 */
		this.scrolling = false;

		/**
		 * amount of pixels to scroll from top for adding "has-scrolled" state class
		 * @type {number}
		 */
		this.scrollNavigationOffset = 200;
		/**
		 * variable for storing amount of scroll from top position value
		 * @type {number}
		 */
		this.previousTop = 0;
		/**
		 * variable for storing current scroll position value
		 * @type {number}
		 */
		this.currentTop = 0;
		this.scrollDelta = 0;
		this.scrollOffset = 0;

		/**
		 * fetch navigation element DOM element
		 * @type {Element}
		 */
		this.navigation = document.querySelector(this.DOM.navigation);
		this.hamburgers = document.querySelectorAll(this.DOM.hamburger);
		this.mobileNavigation = document.querySelector(this.DOM.mobileNavigation);
		this.mobileNavigationInner = document.querySelector(this.DOM.mobileNavigationInner);
		this.mobileNavigationLogo = document.querySelector(this.DOM.mobileNavigationLogo);
		this.mobileNavigationItems = document.querySelectorAll(this.DOM.mobileNavigationItem);
		this.mobileNavigationItemWrapper = document.querySelector(this.DOM.mobileNavigationItemWrapper);
		this.overlay = document.querySelector(this.DOM.overlay);

		this.smoothScroll = null;
	}

	isAnimating = false;
	shapeOverlays: ShapeOverlays | null = null;

	init(smoothScrollInstance: SmoothScroll | null) {
		if (this.navigation !== null) {
			this.navigationController();
		} else {
			console.error(`${this.DOM.navigation} does not exist in the DOM!`);
		}

		this.smoothScroll = smoothScrollInstance;

		if (
			this.hamburgers.length &&
			this.mobileNavigation &&
			this.overlay &&
			this.mobileNavigationItems.length &&
			this.mobileNavigationLogo &&
			this.mobileNavigationItemWrapper
		) {
			this.setupMobileNavigation();
		}
	}

	navigationController() {
		document.addEventListener('scroll', () => {
			if (!this.scrolling) {
				this.scrolling = true;

				if (!window.requestAnimationFrame) {
					setTimeout(this.checkScroll, 250);
				} else {
					requestAnimationFrame(() => this.checkScroll());
				}
			}
		});
	}

	checkScroll() {
		const currentTop = window.pageYOffset || document.body.scrollTop;
		this.changeNavigationState(currentTop);
		this.previousTop = currentTop;
		this.scrolling = false;
	}

	changeNavigationState(scrollPosition: number) {
		if (scrollPosition > this.scrollNavigationOffset) {
			this.navigation.classList.add(this.DOM.states.navigationScrolled);
		} else {
			this.navigation.classList.remove(this.DOM.states.navigationScrolled);
		}

		if (this.previousTop >= scrollPosition) {
			this.scrollingUp(scrollPosition);
		} else {
			this.scrollingDown(scrollPosition);
		}
	}

	scrollingUp(scrollPosition: number) {
		if (scrollPosition < this.scrollNavigationOffset) {
			this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
		} else if (this.previousTop - scrollPosition > this.scrollDelta) {
			this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
		}
	}

	scrollingDown(scrollPosition: number) {
		if (scrollPosition > this.scrollNavigationOffset + this.scrollOffset) {
			this.navigation.classList.add(this.DOM.states.navigationSlideUp);
		} else if (scrollPosition > this.scrollNavigationOffset) {
			this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
		}
	}

	setupMobileNavigation() {
		this.shapeOverlays = new ShapeOverlays(this.overlay);

		this.hamburgers.forEach(($hamburgerEl) => {
			$hamburgerEl.addEventListener('click', () => {
				if (!this.isAnimating) {
					if (($hamburgerEl as HTMLElement).classList.contains(this.DOM.states.active)) {
						this.closeNav();
					} else {
						this.openNav();
					}
				}
			});
		});
	}

	/**
	 * Multiplier applied to every menu duration, delay and stagger. Reduced
	 * motion collapses the sequence to zero so the end states land at once.
	 */
	get motionScale() {
		return prefersReducedMotion() ? 0 : 1;
	}

	closeNav() {
		const scale = this.motionScale;

		this.isAnimating = true;
		this.hamburgers.forEach(($hamburgerEl) => {
			($hamburgerEl as HTMLElement).classList.remove(this.DOM.states.active);
		});

		gsap.to(this.mobileNavigationItems, {
			autoAlpha: 0,
			duration: 0.4 * scale,
			stagger: {
				each: 0.1 * scale,
				grid: 'auto',
				ease: 'power2.inOut',
			},
		});

		gsap.to(this.mobileNavigationItemWrapper, {
			y: 20,
			duration: 0.8 * scale,
			delay: 0,
		});

		gsap.to(this.mobileNavigationLogo, {
			autoAlpha: 0,
			y: 20,
			duration: 0.3 * scale,
			delay: 0.2 * scale,
		});

		setTimeout(() => {
			this.mobileNavigationInner.classList.remove(this.DOM.states.active);
			this.shapeOverlays?.toggle(() => {
				this.mobileNavigation.classList.remove(this.DOM.states.active);
				this.done();
				this.unlockScroll();
			});
		}, 600 * scale);
	}

	lockScroll() {
		document.documentElement.classList.add('is-scroll-locked');
		this.smoothScroll?.scrollLock();
	}

	unlockScroll() {
		document.documentElement.classList.remove('is-scroll-locked');
		this.smoothScroll?.unlockScroll();
	}

	done() {
		this.isAnimating = false;
	}

	openNav() {
		const scale = this.motionScale;

		this.isAnimating = true;
		this.hamburgers.forEach(($hamburgerEl) => {
			($hamburgerEl as HTMLElement).classList.add(this.DOM.states.active);
		});
		this.mobileNavigationInner.classList.add(this.DOM.states.active);
		this.mobileNavigation.classList.add(this.DOM.states.active);
		this.lockScroll();
		this.shapeOverlays?.toggle(() => this.done());

		gsap.fromTo(
			this.mobileNavigationItems,
			{
				autoAlpha: 0,
			},
			{
				autoAlpha: 1,
				duration: 0.4 * scale,
				stagger: {
					each: 0.1 * scale,
					grid: 'auto',
					ease: 'power2.inOut',
				},
				delay: 0.8 * scale,
			},
		);

		gsap.fromTo(
			this.mobileNavigationItemWrapper,
			{
				y: -20,
			},
			{
				y: 0,
				duration: 0.8 * scale,
				delay: 0.7 * scale,
			},
		);

		gsap.fromTo(
			this.mobileNavigationLogo,
			{
				autoAlpha: 0,
				y: -20,
			},
			{
				y: 0,
				autoAlpha: 1,
				duration: 0.3 * scale,
				delay: 0.6 * scale,
			},
		);
	}
}
