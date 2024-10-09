import { highContrastVariant } from '$lib/props/high-contrast.prop';
import type { Snippet } from 'svelte';
import { tv, type VariantProps } from 'tailwind-variants';

export const as = ['span', 'div', 'label', 'p'] as const;

export type Props = {
	as?: (typeof as)[number];
	color?: AccentColor;
	children?: Snippet;
} & VariantProps<typeof text>;

export type AttributeProps = {
	className: string;
	'data-accent-color'?: AccentColor;
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
		},
		...highContrastVariant
	}
});
