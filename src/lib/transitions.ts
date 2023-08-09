import type { TransitionConfig } from 'svelte/transition';

export function fadeScale(
	node: Element,
	{ delay = 0, duration = 200, easing = (x) => x, baseScale = 0 }
): TransitionConfig {
	const o = +getComputedStyle(node).opacity;
	const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
	console.log({ m });
	const s = m ? m[1] : 1;
	const is = 1 - baseScale;

	return {
		delay,
		duration,
		css: (t) => {
			const eased = easing(t);
			return `opacity: ${eased * o}; transform: scale(${eased * s * is + baseScale})`;
		}
	};
}

export function gentleFly(
	node: Element,
	{ delay = 0, duration = 200, easing = (x: number) => x, y = 10, opacity = 0.5 }
): TransitionConfig {
	const o = +getComputedStyle(node).opacity;
	const m = getComputedStyle(node).transform.match(/translateY\(([0-9.]+)\)/);
	const y0 = m ? m[1] : 0;
	// const s = m ? m[1] : 1;
	// const is = 1 - baseScale;

	return {
		delay,
		duration,
		css: (t) => {
			const eased = easing(t);
			return `opacity: ${eased * o}; transform: translateY(${(1 - eased) * y}px)`;
		}
	};
}


import { crossfade } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';
import { styleToString } from '@melt-ui/svelte/internal/helpers';

export const [send, receive] = crossfade({
	// delay: 500,
	duration: 500,
	easing: cubicOut
});


const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
	const [minA, maxA] = scaleA;
	const [minB, maxB] = scaleB;

	const percentage = (valueA - minA) / (maxA - minA);
	const valueB = percentage * (maxB - minB) + minB;

	return valueB;
};

type FlyAndScaleOptions = {
	y: number;
	start: number;
	duration?: number;
};
export const flyAndScale = (node: HTMLElement, options: FlyAndScaleOptions): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	return {
		duration: options.duration ?? 150,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [options.y, 0]);
			const scale = scaleConversion(t, [0, 1], [options.start, 1]);

			return styleToString({
				transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
				opacity: t,
			});
		},
		easing: cubicOut,
	};
};
