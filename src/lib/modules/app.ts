import BackgroundShapeAnimation from '@/lib/modules/background-shape.animation';
import BrushTextAnimation from '@/lib/modules/brush-text.animation';
import ContentAnimation from '@/lib/modules/content.animation';
import HeaderLoadAnimation from '@/lib/modules/header-load.animation';
import HeaderAnimation from '@/lib/modules/header.animation';
import LoaderAnimation from '@/lib/modules/loader.animation';
import NavigationController from '@/lib/modules/navigation-controller';
import ParallaxBackgroundAnimation from '@/lib/modules/parallax-bg.animation';
import SectionSeparatorsAnimation from '@/lib/modules/section-separators.animation';
import SmoothScroll from '@/lib/modules/smooth-scroll';
import { Viewport } from '@/lib/modules/viewport';
import { delay } from '@/utils/delay';
import { prefersReducedMotion } from '@/utils/motion';
import {
	isTransitionBeforePreparationEvent,
	TRANSITION_AFTER_PREPARATION,
	TRANSITION_AFTER_SWAP,
	TRANSITION_BEFORE_PREPARATION,
	type TransitionBeforePreparationEvent,
} from 'astro:transitions/client';

export default class App {
	viewport: Viewport;
	backgroundShapeAnimation: BackgroundShapeAnimation | null;
	brushTextAnimation: BrushTextAnimation | null;
	contentAnimation: ContentAnimation | null;
	navigationController: NavigationController | null;
	parallaxBackgroundAnimation: ParallaxBackgroundAnimation | null;
	sectionSeparatorsAnimation: SectionSeparatorsAnimation | null;
	loaderAnimation: LoaderAnimation | null;
	headerAnimation: HeaderAnimation | null;
	headerLoadAnimation: HeaderLoadAnimation | null;
	smoothScroll: SmoothScroll | null;

	body: HTMLElement | null;
	time: number;

	constructor() {
		this.body = document.querySelector('body');
		this.viewport = new Viewport();
		this.time = 0;

		// this.dom = null;
		this.backgroundShapeAnimation = null;
		this.brushTextAnimation = null;
		this.contentAnimation = null;
		this.navigationController = null;
		this.parallaxBackgroundAnimation = null;
		this.sectionSeparatorsAnimation = null;
		this.loaderAnimation = null;
		this.headerAnimation = null;
		this.headerLoadAnimation = null;
		this.smoothScroll = null;

		this.init();
	}

	init() {
		const reducedMotion = prefersReducedMotion();

		this.loaderAnimation = new LoaderAnimation();
		this.headerAnimation = new HeaderAnimation();
		this.navigationController = new NavigationController();

		// Lenis hijacks the native scroll from its constructor, so under reduced
		// motion it is never built. NavigationController falls back to a plain
		// overflow lock when it has no instance.
		if (!reducedMotion) {
			this.smoothScroll = new SmoothScroll();
			this.smoothScroll.init();
		}

		this.navigationController.init(this.smoothScroll);

		this.initEvents();

		// Every deferred module is decoration: parallax, drifting background
		// shapes and reveal-on-scroll tweens. None of their targets are hidden by
		// CSS, so skipping them under reduced motion leaves the content in its
		// natural, fully visible state.
		if (reducedMotion) {
			return;
		}

		// Defer non-critical animations to reduce main-thread blocking
		requestAnimationFrame(() => {
			this.backgroundShapeAnimation = new BackgroundShapeAnimation();
			this.brushTextAnimation = new BrushTextAnimation();
			this.contentAnimation = new ContentAnimation();
			this.parallaxBackgroundAnimation = new ParallaxBackgroundAnimation();
			this.sectionSeparatorsAnimation = new SectionSeparatorsAnimation();
			this.headerLoadAnimation = new HeaderLoadAnimation();

			this.renderDeferred();
		});
	}

	initEvents() {
		new ResizeObserver(() => this.resize()).observe(this.body!);
		document.addEventListener(TRANSITION_BEFORE_PREPARATION, (event: Event) =>
			this.handlePreparationEvent(event),
		);
		document.addEventListener(TRANSITION_AFTER_PREPARATION, () => this.handleOnPreparationEnd());
		document.addEventListener(TRANSITION_AFTER_SWAP, () => this.handleOnSwapEnd());
	}

	// resize({ contentRect }) {
	resize() {
		this.viewport?.resize();
	}

	renderDeferred() {
		this.backgroundShapeAnimation?.init();
		this.brushTextAnimation?.init();
		this.parallaxBackgroundAnimation?.init();
		this.sectionSeparatorsAnimation?.init();
		this.headerLoadAnimation?.init();
		this.contentAnimation?.init();
	}

	/* Events */
	handleOnTransitionStart(ev: TransitionBeforePreparationEvent) {
		const originalLoader = ev.loader;
		ev.loader = async () => {
			if (!document.body.classList.contains('is-transitioning')) {
				document.body.classList.add('is-transitioning');
				this.loaderAnimation?.showLoader();
			}
			await originalLoader();
			// The wipe snaps under reduced motion, so holding the transition open
			// for it would just be a second of blank screen.
			await delay(prefersReducedMotion() ? 0 : 1000);
		};
	}

	handleOnPreparationEnd() {
		this.smoothScroll?.kill();
		this.headerLoadAnimation?.kill();
	}

	handleOnSwapEnd() {
		this.loaderAnimation?.hideLoader();
		document.body.classList.remove('is-transitioning');
	}

	handlePreparationEvent(preparationEvent: Event) {
		if (isTransitionBeforePreparationEvent(preparationEvent)) {
			this.handleOnTransitionStart(preparationEvent);
		}
	}
}
