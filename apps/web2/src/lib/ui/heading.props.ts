import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

const as = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
const sizes = ['1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export type Props = {
	as?: (typeof as)[number];
	children: Snippet;
	size?: (typeof sizes)[number];
	color?: AccentColor;
	highContrast?: boolean;
	class?: string;
};

export const heading = tv({
	base: ['font-default font-bold'],
	variants: {
		size: {
			'1': 'text-1 leading-4',
			'2': 'text-2 leading-[18px]',
			'3': 'text-3 leading-[22px]',
			'4': 'text-4 leading-6',
			'5': 'text-5 leading-[26px]',
			'6': 'text-6 leading-[30px]',
			'7': 'text-7 leading-9',
			'8': 'text-8 leading-10',
			'9': 'text-9 leading-[60px]'
		}
	},
	defaultVariants: {
		size: '6'
	}
});
