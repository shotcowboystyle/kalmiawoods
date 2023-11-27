import type { GenericObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class HeaderAnimation {
	DOM: GenericObject;
	// wrapper: HTMLElement;
	logo: HTMLElement;
	// image: HTMLElement;
	// imageWrapper: HTMLElement;
	navigation: HTMLElement;

	constructor() {
		this.DOM = {
			// wrapper: '.js-home-header',
			logo: '.js-navigation-logo',
			navigation: '.js-navigation',
			// image: '.js-home-header-image',
			// imageWrapper: '.js-home-header-image-wrapper',
			states: {
				hasLoaded: 'has-loaded',
				scrollLockTop: 'scroll-lock-top',
			},
		};

		// this.wrapper = document.querySelector(this.DOM.wrapper);
		this.logo = document.querySelector(this.DOM.logo);
		// this.image = document.querySelector(this.DOM.image);
		// this.imageWrapper = document.querySelector(this.DOM.imageWrapper);
		this.navigation = document.querySelector(this.DOM.navigation);
		// this.smoothScroll = t;
	}

	init() {
		// if (this.logo && this.wrapper && this.image && this.imageWrapper && this.navigation) {
		if (this.logo && this.navigation) {
			document.body.classList.add(this.DOM.states.scrollLockTop);
			this.animate();
		}
	}

	animate() {
		const isMobile = window.innerWidth <= 800;

		gsap
			.timeline({
				delay: 1,
			})
			.set(this.logo, {
				yPercent: isMobile ? 250 : 150,
				scale: 2,
			})
			.fromTo(
				this.navigation,
				{
					y: -40,
					opacity: 0,
				},
				{
					y: 0,
					duration: 0.6,
					opacity: 1,
					clearProps: 'all',
					ease: 'power3.out',
					onComplete: () => {
						this.navigation.classList.add(this.DOM.states.hasLoaded);
						document.body.classList.remove(this.DOM.states.scrollLockTop);
						this.onScroll();
						setTimeout(() => {
							ScrollTrigger.refresh();
						}, 100);
					},
				},
			);
		// .to(
		// 	this.image,
		// 	{
		// 		scale: 1,
		// 		duration: 1.6,
		// 		ease: 'expo.inOut',
		// 	},
		// 	'0',
		// )
		// .to(
		// 	this.imageWrapper,
		// 	{
		// 		scale: 1,
		// 		duration: 1.6,
		// 		borderRadius: 0,
		// 		ease: 'expo.inOut',
		// 		onComplete: () => {
		// 			document.body.classList.remove(this.DOM.states.scrollLockTop);
		// 			this.onScroll();
		// 			setTimeout(() => {
		// 				ScrollTrigger.refresh();
		// 			}, 100);
		// 		},
		// 	},
		// 	'0',
		// );
	}

	onScroll() {
		gsap.to(this.logo, {
			yPercent: 0,
			scale: 1,
			scrollTrigger: {
				trigger: this.navigation,
				start: 'top top',
				end: '+=300',
				scrub: 0.2,
			},
		});

		// gsap.to(this.image, {
		// 	yPercent: 30,
		// 	scrollTrigger: {
		// 		trigger: this.wrapper,
		// 		start: 'top top',
		// 		end: 'bottom top',
		// 		scrub: 0.1,
		// 	},
		// });

		// gsap.to(this.image, {
		// 	opacity: 0.3,
		// 	scrollTrigger: {
		// 		trigger: this.wrapper,
		// 		start: '50% top',
		// 		end: 'bottom top',
		// 		scrub: 0.1,
		// 	},
		// });
	}
}
