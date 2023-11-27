import type { GenericObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class ContentAnimation {
	DOM: GenericObject;
	container: Document;
	animatedContent: NodeListOf<HTMLElement> | [];
	animatedStaggerElements: NodeListOf<HTMLElement> | [];

	constructor() {
		this.DOM = {
			animatedContent: '.js-animated-content',
			animatedContentElement: '.js-animated-content-element',
			animatedStaggerElement: '.js-animated-stagger-element',
			states: {
				isAnimated: 'is-animated',
			},
		};

		this.container = document;
		this.animatedContent = [];
		this.animatedStaggerElements = [];
	}

	init() {
		this.animatedContent = this.container.querySelectorAll(this.DOM.animatedContent);
		this.animatedStaggerElements = this.container.querySelectorAll(this.DOM.animatedStaggerElement);
		setTimeout(() => {
			this.animationsReset();
			this.initAnimations();
		}, 300);
	}

	initAnimations() {
		if (this.animatedContent.length) {
			for (let e = 0, t = this.animatedContent.length; e < t; e++) {
				const triggerEl = this.animatedContent[e].querySelectorAll(this.DOM.animatedContentElement);
				const tl = gsap.timeline({
					overwrite: 'auto',
				});

				tl.add('start').fromTo(
					triggerEl,
					{
						y: 40,
						autoAlpha: 0,
					},
					{
						autoAlpha: 1,
						duration: 1.2,
						y: '0%',
						stagger: {
							each: 0.075,
							from: 'start',
						},
						ease: 'expo.out',
					},
				);

				ScrollTrigger.create({
					trigger: triggerEl,
					animation: tl,
					start: 'top bottom-=20%',
					toggleClass: this.DOM.states.isAnimated,
					once: true,
				});
			}
		}

		if (this.animatedStaggerElements.length) {
			gsap.set(this.animatedStaggerElements, {
				autoAlpha: 0,
			});

			this.animatedStaggerElements.forEach(($staggerEl) => {
				gsap.fromTo(
					$staggerEl,
					{
						y: 40,
						autoAlpha: 0,
					},
					{
						autoAlpha: 1,
						duration: 1.2,
						overwrite: 'auto',
						y: 0,
						ease: 'expo.out',
						scrollTrigger: {
							trigger: $staggerEl,
							start: 'top 90%',
							end: 'top center',
							scrub: 1,
						},
					},
				);
			});
		}
	}

	animationsReset() {
		if (this.animatedContent.length) {
			this.animatedContent.forEach(($contentEl) => {
				gsap.set([$contentEl.querySelectorAll(this.DOM.animatedContentElement)], {
					autoAlpha: 0,
				});
			});
		}

		if (this.animatedStaggerElements.length) {
			gsap.set(this.animatedStaggerElements, {
				autoAlpha: 0,
			});
		}
	}
}
