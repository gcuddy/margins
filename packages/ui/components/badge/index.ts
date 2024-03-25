import { tv, type VariantProps } from 'tailwind-variants';

export { default as Badge } from './badge.svelte';
export const badgeVariants = tv({
	base: 'inline-flex items-center rounded border px-2.5 py-0.5 text-xs gap-x-1 font-medium justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none',
	variants: {
		variant: {
			default: 'border-transparent bg-attention text-attention-foreground',
			secondary:
				'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
			destructive:
				'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
			outline: 'text-foreground',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

export type Variant = VariantProps<typeof badgeVariants>['variant'];
