import { cn } from '@margins/lib';
import { tv } from 'tailwind-variants';

export const shadowLookup: Record<string, string> = {
	5: cn('shadow-5 dark:shadow-5-dark'),
	6: cn('shadow-6 dark:shadow-6-dark'),
};

export const shadows = (num: string | number) => shadowLookup[num];

export const panel = tv({
	base: [],
	variants: {
		background: {
			translucent:
				'bg-whitea-9 dark:bg-sanddarka-2 backdrop-blur-3xl backdrop-brightness-[0.2] backdrop-saturate-200',
			solid: 'dark:bg-sand-2 bg-white backdrop-blur-none',
			auto: 'bg-whitea-9 dark:bg-sanddarka-2 solid:bg-white dark:solid:bg-sandddark-2 solid:backdrop-blur-none backdrop-blur-3xl backdrop-brightness-[0.2] backdrop-saturate-200',
		},
		shadow: {
			'5': shadows(5),
			'6': shadows(6),
			false: '',
		},
	},
	defaultVariants: {
		background: 'solid',
		shadow: '5',
	},
});
