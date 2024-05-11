import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'focus-visible:ring-ring group inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
	defaultVariants: {
		size: 'default',
		variant: 'default',
	},
	variants: {
		size: {
			default: 'h-9 px-4 py-2',
			icon: 'h-9 w-9 rounded-[10px]',
			iconSmall: 'h-7 w-7 rounded-md',
			lg: 'h-10 rounded-md px-8',
			sm: 'h-8 rounded-md px-3 text-xs',
			xl: 'h-12 rounded-md px-8 text-base',
		},
		variant: {
			default:
				'bg-primary text-primary-foreground shadow-subtle hover:bg-primary-hover',
			destructive:
				'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'text-foreground underline-offset-4 hover:underline',
			outline:
				'border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm',
			secondary:
				'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
		},
	},
});
