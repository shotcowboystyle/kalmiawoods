import type { GenericObject } from '@/types/common';

export default class LinkAnimation {
	DOM: GenericObject;
	contextShifting: NodeListOf<HTMLElement>;

	constructor($el: HTMLElement) {
		this.DOM = {
			contextShifting: '.js-focus-shifting',
			item: '.js-focus-shifting-item',
			states: {
				isBlurred: 'is-blurred',
				isFocused: 'is-focused',
			},
		};
		this.contextShifting = $el.querySelectorAll(this.DOM.contextShifting);
	}

	init() {
		0 < this.contextShifting.length &&
			this.contextShifting.forEach(($shiftingEl: HTMLElement) => {
				this.linkEvents($shiftingEl);
			});
	}

	linkEvents($linkEl: HTMLElement) {
		const $linkItems = $linkEl.querySelectorAll<HTMLElement>(this.DOM.item);

		$linkItems.forEach(($linkItemEl) => {
			$linkItemEl.addEventListener('mouseenter', () => {
				this.blurOtherItems($linkItems);
				this.focusCurrentItem($linkItemEl);
			});
			$linkItemEl.addEventListener('mouseleave', () => {
				this.resetState($linkItems);
			});
		});
	}

	focusCurrentItem($itemEl: HTMLElement) {
		$itemEl.classList.add(this.DOM.states.isFocused);
		$itemEl.classList.remove(this.DOM.states.isBlurred);
	}

	blurOtherItems($itemEls: NodeListOf<HTMLElement>) {
		$itemEls.forEach(($item) => {
			$item.classList.remove(this.DOM.states.isFocused);
			$item.classList.add(this.DOM.states.isBlurred);
		});
	}

	resetState($itemEls: NodeListOf<HTMLElement>) {
		$itemEls.forEach(($item) => {
			$item.classList.remove(this.DOM.states.isBlurred);
		});
	}
}
