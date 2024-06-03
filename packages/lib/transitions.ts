import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

type FlyAndScaleParams = {
	duration?: number;
	start?: number;
	x?: number;
	y?: number;
};

const scaleConversion = (
	valueA: number,
	scaleA: [number, number],
	scaleB: [number, number],
) => {
	const [minA, maxA] = scaleA;
	const [minB, maxB] = scaleB;

	const percentage = (valueA - minA) / (maxA - minA);
	const valueB = percentage * (maxB - minB) + minB;

	return valueB;
};

const styleToString = (
	style: Record<string, number | string | undefined>,
): string => {
	return Object.keys(style).reduce((str, key) => {
		if (style[key] === undefined) return str;
		return str + key + ':' + style[key] + ';';
	}, '');
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { duration: 160, start: 0.97 },
): TransitionConfig => {
	const side = (node as HTMLElement).dataset?.side;
	const domState = (node as HTMLElement).dataset?.state;
	// bc snapshot before change
	const state = domState === 'open' ? 'closed' : 'open';
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;
	let defaultY = side === 'bottom' ? 4 : -4;
	let defaultX = side === 'left' || side === 'right' ? 4 : 0;
	if (state === 'closed') {
		defaultY = defaultY * -1;
		defaultX = defaultX * -1;
	}
	// const defaultY = side === 'bottom' && state === 'closed' ? 4 : side === 'top' && state === 'closed' ? 4 :

	return {
		css: (t) => {
			const state = (node as HTMLElement).dataset?.state;
			const side = (node as HTMLElement).dataset?.side;
			const y = scaleConversion(t, [0, 1], [params.y ?? defaultY, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? defaultX, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.97, 1]);

			return styleToString({
				opacity: t,
				transform:
					transform +
					'translate3d(' +
					x +
					'px, ' +
					y +
					'px, 0) scale(' +
					scale +
					')',
			});
		},
		delay: 0,
		duration: params.duration ?? 200,
		easing: cubicOut,
	};
};
