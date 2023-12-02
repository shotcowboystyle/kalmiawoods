import type { StringObject } from '@/types/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default class BrushTextAnimation {
	DOM: StringObject;
	wrapper: NodeListOf<HTMLElement>;
	loadWrapper: NodeListOf<HTMLElement>;

	constructor() {
		this.DOM = {
			wrapper: '.js-brush-text-scroll',
			loadWrapper: '.js-brush-text-on-load',
			text: '.js-text-line',
			textClone: '.js-text-line-clone',
		};
		this.wrapper = document.querySelectorAll(this.DOM.wrapper);
		this.loadWrapper = document.querySelectorAll(this.DOM.loadWrapper);
	}

	init() {
		if (this.wrapper.length) {
			setTimeout(() => {
				this.wrapper.forEach(($wrapperEl) => {
					this.textController($wrapperEl);
				});
			}, 300);
		}

		if (this.loadWrapper.length) {
			setTimeout(() => {
				this.loadWrapper.forEach(($loadWrapperEl) => {
					this.textControllerLoad($loadWrapperEl);
				});
			}, 300);
		}
	}

	textController($wrapperEl: HTMLElement) {
		let $textEl: HTMLElement | null | SplitType = $wrapperEl.querySelector<HTMLElement>(
			this.DOM.text,
		);
		let $textCloneEl: HTMLElement | null | SplitType = $wrapperEl.querySelector<HTMLElement>(
			this.DOM.textClone,
		);

		if ($textEl && $textCloneEl) {
			$textEl = new SplitType($textEl, {
				types: 'lines',
				lineClass: 'lineParent',
			});

			if ($textEl.lines) {
				new SplitType($textEl.lines, {
					types: 'lines',
					lineClass: 'lineChild',
				});

				$textEl = new SplitType($textCloneEl, {
					types: 'lines',
					lineClass: 'lineParent',
				});

				if ($textEl.lines) {
					$textCloneEl = new SplitType($textEl.lines, {
						types: 'lines',
						lineClass: 'lineChild',
					});

					gsap.set(($textCloneEl as SplitType).lines, {
						x: '100%',
					});

					gsap.set($textEl.lines, {
						x: '-100%',
					});

					if ($textCloneEl.lines && $textEl.lines) {
						$textCloneEl.lines.forEach(($linesEl: HTMLElement) => {
							gsap.to($linesEl, {
								x: '0%',
								scrollTrigger: {
									scrub: 0.8,
									trigger: $linesEl,
									start: 'bottom 80%',
									end: 'bottom '.concat(
										(0.7 * window.innerHeight - $linesEl.offsetHeight).toString(),
									),
									toggleActions: 'play play play play',
								},
							});
						});

						$textEl.lines.forEach(($linesEl) => {
							gsap.to($linesEl, {
								x: '0%',
								scrollTrigger: {
									scrub: 0.8,
									trigger: $linesEl,
									start: 'bottom 80%',
									end: 'bottom '.concat(
										(0.7 * window.innerHeight - $linesEl.offsetHeight).toString(),
									),
									toggleActions: 'play play play play',
								},
							});
						});
					}
				}
			}
		}
	}

	textControllerLoad($loadWrapperEl: HTMLElement) {
		let $textEl: HTMLElement | null | SplitType = $loadWrapperEl.querySelector<HTMLElement>(
			this.DOM.text,
		);
		let $textCloneEl: HTMLElement | null | SplitType = $loadWrapperEl.querySelector<HTMLElement>(
			this.DOM.textClone,
		);

		if ($textEl && $textCloneEl) {
			$textEl = new SplitType($textEl, {
				types: 'lines',
				lineClass: 'lineParent',
				// lineThreshold: 0.5,
			});

			if ($textEl.lines) {
				new SplitType($textEl.lines, {
					types: 'lines',
					lineClass: 'lineChild',
					// lineThreshold: 0.5,
				});

				$textEl = new SplitType($textCloneEl, {
					types: 'lines',
					lineClass: 'lineParent',
					// lineThreshold: 0.5,
				});

				if ($textEl.lines) {
					$textCloneEl = new SplitType($textEl.lines, {
						types: 'lines',
						lineClass: 'lineChild',
						// lineThreshold: 0.5,
					});

					gsap.set($textCloneEl.lines, {
						xPercent: 100,
					});

					gsap.set($textEl.lines, {
						xPercent: -100,
					});

					gsap.to($textCloneEl.lines, {
						xPercent: 0,
						duration: 0.6,
						stagger: 0.4,
						delay: 0.3,
					});

					gsap.to($textEl.lines, {
						xPercent: 0,
						duration: 0.6,
						stagger: 0.4,
						delay: 0.3,
					});
				}
			}
		}
	}
}
