// import { gsap } from 'gsap';
// import { dot, heroLogo, sectionWrapper } from './Hero.astro.0.mts';

// if (heroLogo && dot && sectionWrapper) {
// 	const sectionWrapperBounds = sectionWrapper.getBoundingClientRect();
// 	const heroLogoBounds = heroLogo.getBoundingClientRect();

// 	gsap.set(dot, {
// 		width: '102vmax',
// 		height: '152vmax',
// 		xPercent: -50,
// 		yPercent: -50,
// 		top: '50%',
// 		left: '50%',
// 	});

// 	let tl1 = gsap.timeline({
// 		scrollTrigger: {
// 			trigger: sectionWrapper,
// 			start: 'top center',
// 			end: 'bottom top',
// 			markers: true,
// 			scrub: 1.5,
// 			pin: sectionWrapper,
// 			pinSpacing: true,
// 			invalidateOnRefresh: true,
// 		},
// 		defaults: { ease: 'none' },
// 	});

// 	tl1.to(sectionWrapper, { opacity: 1 }).fromTo(
// 		dot,
// 		{
// 			scale: 0,
// 			x: () => {
// 				const px = heroLogoBounds.left + heroLogoBounds.width * 0.54; // dot is about 54% from the left of the bounds of the character
// 				return px - sectionWrapperBounds.width / 2;
// 			},
// 			y: () => {
// 				const py = heroLogoBounds.top + heroLogoBounds.height * 0.73; // dot is about 73% from the top of the bounds of the character
// 				return py - sectionWrapperBounds.height / 2;
// 			},
// 		},
// 		{
// 			x: 0,
// 			y: 0,
// 			ease: 'power3.in',
// 			scale: 1,
// 			borderRadius: 0,
// 		},
// 	);
// }
