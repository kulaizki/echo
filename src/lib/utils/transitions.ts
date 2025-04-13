import { cubicOut } from 'svelte/easing';

export function blurFly(
	node: HTMLElement,
	params: {
		delay?: number;
		duration?: number;
		easing?: (t: number) => number;
	} = {}
): {
	delay: number;
	duration: number;
	easing: (t: number) => number;
	css: (t: number) => string;
} {
	const existingTransform = getComputedStyle(node).transform.replace('none', '');
	return {
		delay: params.delay || 0,
		duration: params.duration || 1500,
		easing: params.easing || cubicOut,
		css: (t: number) => `
			transform: ${existingTransform} translateY(${(1 - t) * 100}px);
			opacity: ${t};
			filter: blur(${(1 - t) * 10}px);
		`
	};
} 