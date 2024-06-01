import type { Button as ButtonPrimitive } from 'bits-ui';
import { tv, type VariantProps } from 'tailwind-variants';
import Root from './button.svelte';
import { baseButton } from '../base-button.js';

const buttonVariants = tv({
	extend: baseButton,
	base: 'm-Button',
});
// const buttonVariants = tv({
// 	base: 'focus-visible:ring-ring group inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
// 	variants: {
// 		size: {
// 			md: 'h-9 px-4 py-2',
// 			icon: 'h-9 w-9 rounded-[10px]',
// 			iconSmall: 'h-7 w-7 rounded-md',
// 			lg: 'h-10 rounded-md px-8',
// 			sm: 'h-8 rounded-md px-3 text-xs',
// 			xl: 'h-12 rounded-md px-8 text-base',
// 		},
// 		variant: {
// 			classic: 'bg-accent-9 text-accent-contrast relative z-0',
// 			solid:
// 				'bg-accent-9 text-accent-contrast hover:bg-accent-10 active:bg-accent-10 active:brightness-[0.92] active:saturate-[1.1] dark:active:brightness-[1.08] dark:active:saturate-[1]',
// 			soft: 'text-accentA-11 bg-accentA-3',
// 			destructive:
// 				'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
// 			ghost: 'hover:bg-accent hover:text-accent-foreground',
// 			link: 'text-foreground underline-offset-4 hover:underline',
// 			outline:
// 				'border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm',
// 			secondary:
// 				'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
// 		},
// 		icon: {
// 			true: 'h-9 w-9',
// 		},
// 		color: {
// 			gray: '',
// 			accent: '',
// 		},
// 	},
// 	compoundVariants: [
// 		{
// 			variant: 'soft',
// 			color: 'gray',
// 			class: 'bg-grayA-3 text-grayA-11',
// 		},
// 	],
// 	defaultVariants: {
// 		size: 'md',
// 		variant: 'solid',
// 		icon: false,
// 	},
// });

type Variant = VariantProps<typeof buttonVariants>['variant'];
type Size = VariantProps<typeof buttonVariants>['size'];

type Props = ButtonPrimitive.Props & {
	color?: VariantProps<typeof buttonVariants>['color'];
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
