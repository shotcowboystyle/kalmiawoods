import ShapeOverlays from '@/lib/shape-overlays';
import SmoothScroll from '@/lib/smooth-scroll';
import type { GenericObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class NavigationController {
	DOM: GenericObject;
	scrollNavigationOffset: number;
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

	constructor() {
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

		this.scrollNavigationOffset = 200;
		this.scrollDelta = 0;
		this.scrollOffset = 0;
		this.navigation = document.querySelector(this.DOM.navigation);
		this.hamburgers = document.querySelectorAll(this.DOM.hamburger);
		this.mobileNavigation = document.querySelector(this.DOM.mobileNavigation);
		this.mobileNavigationInner = document.querySelector(this.DOM.mobileNavigationInner);
		this.mobileNavigationLogo = document.querySelector(this.DOM.mobileNavigationLogo);
		this.mobileNavigationItems = document.querySelectorAll(this.DOM.mobileNavigationItem);
		this.mobileNavigationItemWrapper = document.querySelector(this.DOM.mobileNavigationItemWrapper);
		this.overlay = document.querySelector(this.DOM.overlay);
	}

	scrolling = false;
	isAnimating = false;
	previousTop = 0;
	currentTop = 0;
	smoothScroll: SmoothScroll | null = null;
	shapeOverlays: ShapeOverlays | null = null;

	init() {
		this.navigation != null
			? this.navigationController()
			: console.error(''.concat(this.DOM.navigation, ' does not exist in the DOM!'));

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
			this.scrolling ||
				((this.scrolling = !0),
				!window.requestAnimationFrame
					? setTimeout(this.checkScroll, 250)
					: requestAnimationFrame(() => this.checkScroll()));
		});
	}

	checkScroll() {
		const scrollOffset = window.pageYOffset | document.body.scrollTop;
		this.changeNavigationState(scrollOffset);
		this.previousTop = scrollOffset;
		this.scrolling = false;
	}

	changeNavigationState(scrollPosition: number) {
		scrollPosition > this.scrollNavigationOffset
			? this.navigation.classList.add(this.DOM.states.navigationScrolled)
			: this.navigation.classList.remove(this.DOM.states.navigationScrolled);
		this.previousTop >= scrollPosition
			? this.scrollingUp(scrollPosition)
			: this.scrollingDown(scrollPosition);
	}

	scrollingUp(scrollPosition: number) {
		(scrollPosition < this.scrollNavigationOffset ||
			this.previousTop - scrollPosition > this.scrollDelta) &&
			this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
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
					($hamburgerEl as HTMLElement).classList.contains(this.DOM.states.active)
						? this.closeNav()
						: this.openNav();
				}
			});
		});
	}

	closeNav() {
		this.isAnimating = true;
		this.hamburgers.forEach(($hamburgerEl) => {
			($hamburgerEl as HTMLElement).classList.remove(this.DOM.states.active);
		});

		gsap.to(this.mobileNavigationItems, {
			autoAlpha: 0,
			duration: 0.4,
			stagger: {
				each: 0.1,
				grid: 'auto',
				ease: 'power2.inOut',
			},
		});

		gsap.to(this.mobileNavigationItemWrapper, {
			y: 20,
			duration: 0.8,
			delay: 0,
		});

		gsap.to(this.mobileNavigationLogo, {
			autoAlpha: 0,
			y: 20,
			duration: 0.3,
			delay: 0.2,
		});

		setTimeout(() => {
			this.mobileNavigationInner.classList.remove(this.DOM.states.active);
			this.shapeOverlays?.toggle(() => {
				this.mobileNavigation.classList.remove(this.DOM.states.active),
					this.done(),
					this.smoothScroll?.unlockScroll();
			});
		}, 600);
	}

	done() {
		this.isAnimating = false;
	}

	openNav() {
		this.isAnimating = true;
		this.hamburgers.forEach(($hamburgerEl) => {
			($hamburgerEl as HTMLElement).classList.add(this.DOM.states.active);
		});
		this.mobileNavigationInner.classList.add(this.DOM.states.active);
		this.mobileNavigation.classList.add(this.DOM.states.active);
		this.smoothScroll?.scrollLock();
		this.shapeOverlays?.toggle(() => this.done());

		gsap.fromTo(
			this.mobileNavigationItems,
			{
				autoAlpha: 0,
			},
			{
				autoAlpha: 1,
				duration: 0.4,
				stagger: {
					each: 0.1,
					grid: 'auto',
					ease: 'power2.inOut',
				},
				delay: 0.8,
			},
		);

		gsap.fromTo(
			this.mobileNavigationItemWrapper,
			{
				y: -20,
			},
			{
				y: 0,
				duration: 0.8,
				delay: 0.7,
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
				duration: 0.3,
				delay: 0.6,
			},
		);
	}
}
