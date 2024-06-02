import { tv } from 'tailwind-variants';
import { colorVariant } from '../variants/color.variants.js';
import { createSizeVariant } from '../variants/size.variants.js';
import {
	createVariantVariants,
	variants,
} from '../variants/variant.variants.js';

export const baseButton = tv({
	base: 'm-BaseButton inline-flex shrink-0 select-none items-center justify-center text-center align-top not-italic',
	variants: {
		variant: createVariantVariants(variants),
		color: colorVariant,
		size: createSizeVariant(['sm', 'md', 'lg', 'xl']),
		loading: {
			true: 'm-loading relative',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});
