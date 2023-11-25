import { gsap } from 'gsap';

export interface IMouse {
	x: number;
	y: number;
	moved: boolean;
}

export function parallax(
	event: MouseEvent,
	target: HTMLElement,
	movement: number,
	bounds: DOMRect,
) {
	if (document.querySelector('html')?.classList.contains('scrolling')) {
		return;
	}

	const relX = event.pageX - bounds.left;
	const relY = event.pageY - bounds.top;
	// const relX = window.innerWidth / 2;
	// const relY = window.innerHeight / 2;

	gsap.to(target, {
		x: ((relX - bounds.width / 2) / bounds.width) * movement,
		y: ((relY - bounds.height / 2) / bounds.height) * movement,
		duration: 1,
		ease: 'power2.easeOut',
	});
}

export function parallaxScroll(
	el: HTMLElement,
	container: HTMLElement,
	offset: number,
	// parallaxTimeline: gsap.core.Timeline,
) {
	// console.log('offset', offset);
	gsap.to(
		el,
		// {
		// 	yPercent: 0,
		// },
		{
			yPercent: offset,
			transformOrigin: '50% 50% -400px',
			ease: 'none',
			scrollTrigger: {
				trigger: container,
				start: 'top top',
				end: 'bottom top',
				// markers: true,
				scrub: true,
				// pin: true,
				invalidateOnRefresh: true,
			},
		},
	);
}
