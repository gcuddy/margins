import { LinkPreview as HoverCardPrimitive } from 'bits-ui';

import Content from './hover-card-content.svelte';
import { tv } from 'tailwind-variants';
import { createSizeVariant } from '../../variants/size.variants.js';
import { widthVariants } from '../../variants/width.variants.js';
const Root = HoverCardPrimitive.Root;
const Trigger = HoverCardPrimitive.Trigger;

const hoverCardContent = tv({
	base: 'm-PopperContent m-HoverCardContent',
	variants: {
		size: createSizeVariant(['sm', 'md', 'lg']),
		...widthVariants,
	},
	defaultVariants: {
		size: 'md',
	},
});

export {
	Root,
	Content,
	Trigger,
	Root as HoverCard,
	Content as HoverCardContent,
	Trigger as HoverCardTrigger,
	hoverCardContent,
};
