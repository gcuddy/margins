import type { Button as ButtonPrimitive } from 'bits-ui';
import { tv, type VariantProps } from 'tailwind-variants';
import Root from './button.svelte';

const buttonVariants = tv({
	base: 'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
	defaultVariants: {
		size: 'default',
		variant: 'default',
	},
	variants: {
		size: {
			default: 'h-9 px-4 py-2',
			icon: 'h-9 w-9 rounded-[10px]',
			lg: 'h-10 rounded-md px-8',
			sm: 'h-8 rounded-md px-3 text-xs',
		},
		variant: {
			default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
			destructive:
				'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-foreground underline-offset-4 hover:underline',
			outline:
				'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
			secondary:
				'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
		},
	},
});

type Variant = VariantProps<typeof buttonVariants>['variant'];
type Size = VariantProps<typeof buttonVariants>['size'];

type Props = ButtonPrimitive.Props & {
	size?: Size;
	variant?: Variant;
};

type Events = ButtonPrimitive.Events;

export {
	Root,
	type Props,
	type Events,
	//
	Root as Button,
	type Props as ButtonProps,
	type Events as ButtonEvents,
	buttonVariants,
};
