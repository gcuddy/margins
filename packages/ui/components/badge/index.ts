import { tv, type VariantProps } from 'tailwind-variants';

export { default as Badge } from './badge.svelte';
export const badgeVariants = tv({
	base: 'focus:ring-ring inline-flex select-none items-center justify-center gap-x-1 rounded border px-2.5 py-0.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2',
	defaultVariants: {
		variant: 'default',
	},
	variants: {
		variant: {
			default: 'bg-attention text-attention-foreground border-transparent',
			destructive:
				'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent shadow',
			glass:
				'text-foreground bg-glass/10 hover:bg-glass/20 border-glass/05 backdrop-blur-sm',
			outline: 'text-foreground',
			secondary:
				'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
		},
	},
});

export type Variant = VariantProps<typeof badgeVariants>['variant'];
