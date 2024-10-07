import { Record } from 'effect';
import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

const as = ['span', 'div', 'label', 'p'] as const;
const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export type Props = {
	as?: (typeof as)[number];
	children: Snippet;
	size?: (typeof sizes)[number];
	color?: AccentColor;
	highContrast?: boolean;
};

export const text = tv({
	base: [''],
	variants: {
		size: {
			'1': 'text-1',
			'2': 'text-2',
			'3': 'text-3',
			'4': 'text-4',
			'5': 'text-5',
			'6': 'text-6',
			'7': 'text-7',
			'8': 'text-8',
			'9': 'text-9'
		}
	}
});
