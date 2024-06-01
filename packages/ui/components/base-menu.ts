import { panel } from '../styles/tailwind.js';
import { tv } from 'tailwind-variants';

export const baseMenu = tv({
	// TODO: solid
	base: [panel(), 'base-menu box-border flex flex-col overflow-hidden'],
	variants: {
		variant: {
			soft: 'variant-soft',
		},
	},
	defaultVariants: {
		variant: 'soft',
	},
});
