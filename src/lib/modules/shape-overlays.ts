import { prefersReducedMotion } from '@/utils/motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

export default class ShapeOverlays {
	elm: HTMLElement;
	path: NodeListOf<SVGPathElement> | undefined;
	numPoints: number;
	duration: number;
	delayPointsArray: number[];
	delayPointsMax: number;
	delayPerPath: number;
	timeStart: number;

	constructor($el: HTMLElement) {
		this.elm = $el;
		this.path = null == ($el = this.elm) ? void 0 : $el.querySelectorAll('path');
		this.numPoints = 4;
		this.duration = 800;
		this.delayPointsArray = [];
		this.delayPointsMax = 180;
		this.delayPerPath = 70;
		this.timeStart = Date.now();
	}

	done: (() => any) | null = null;
	isOpened = false;
	isAnimating = false;

	async toggle(...args: any) {
		this.isAnimating = true;

		const callback = args.length && args[0] !== undefined ? args[0] : null;

		const range = Math.random() * Math.PI * 2;
		for (let i = 0; i < this.numPoints; i++) {
			const radian = (i / (this.numPoints - 1)) * Math.PI * 2;
			this.delayPointsArray[i] = ((Math.sin(radian + range) + 1) / 2) * this.delayPointsMax;
		}

		// Assigned before the render loop starts: under reduced motion the loop
		// reaches its end state on the first frame, so a callback set afterwards
		// would never fire.
		this.done = callback;

		if (!this.isOpened) {
			await this.open();
		} else {
			await this.close();
		}
	}

	/**
	 * Total time the wipe needs before every path has reached its end state.
	 * Backdating timeStart by this much makes the first render paint the final
	 * geometry, so the overlay snaps instead of animating.
	 */
	get totalDuration() {
		return (
			this.duration + this.delayPerPath * ((this.path?.length ?? 1) - 1) + this.delayPointsMax + 1
		);
	}

	startTime() {
		return prefersReducedMotion() ? Date.now() - this.totalDuration : Date.now();
	}

	async open() {
		this.isOpened = true;
		this.elm.classList.add('is-opened');
		this.timeStart = this.startTime();
		await this.renderLoop();
	}

	async close() {
		this.isOpened = false;
		this.elm.classList.remove('is-opened');
		this.timeStart = this.startTime();
		await this.renderLoop();
	}

	async updatePath(time: number) {
		const points = [];
		for (let i = 0; i < this.numPoints; i++) {
			// points[i] = 100 * this.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
			points[i] =
				this.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) *
				100;
		}

		let str = '';
		str += this.isOpened ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;

		for (let i = 0; i < this.numPoints - 1; i++) {
			const p = ((i + 1) / (this.numPoints - 1)) * 100;
			const cp = p - ((1 / (this.numPoints - 1)) * 100) / 2;
			str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
		}

		str += this.isOpened ? `V 0 H 0` : `V 100 H 0`;
		return str;
	}

	async render() {
		if (this.path?.length) {
			if (this.isOpened) {
				for (let e = 0; e < this.path.length; e++) {
					this.path[e].setAttribute(
						'd',
						await this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * e)),
					);
				}
			} else {
				for (let t = 0; t < this.path.length; t++) {
					this.path?.[t].setAttribute(
						'd',
						await this.updatePath(
							Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - t - 1)),
						),
					);
				}
			}
		}
	}

	async renderLoop() {
		await this.render();

		if (this.path?.length) {
			if (
				Date.now() - this.timeStart <
				this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax
			) {
				requestAnimationFrame(() => this.renderLoop());
			} else {
				this.isAnimating = false;
				if (this.done !== null) {
					return await this.done();
				}
			}
		}
	}

	cubicInOut(easing: number) {
		return easing < 0.5 ? 4 * easing * easing * easing : 0.5 * Math.pow(2 * easing - 2, 3) + 1;
	}
}
