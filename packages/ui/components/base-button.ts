import { tv } from 'tailwind-variants';
import { colorVariant } from '../variants/color.variants.js';

export const baseButton = tv({
	base: 'm-base-button inline-flex shrink-0 select-none items-center justify-center text-center align-top not-italic',
	variants: {
		variant: {
			ghost: 'm-variant-ghost',
			soft: 'm-variant-soft',
			solid: 'm-variant-solid',
		},
		color: colorVariant,
		size: {
			sm: 'm-size-sm',
			md: 'm-size-md',
			lg: 'm-size-lg',
			xl: 'm-size-xl',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});
