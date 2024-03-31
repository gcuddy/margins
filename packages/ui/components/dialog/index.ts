import { Dialog as DialogPrimitive } from 'bits-ui';

export const dialogVariants = tv({
	base: 'bg-background fixed left-1/2 z-50 grid max-h-[95vh] w-full max-w-lg translate-x-[-50%] gap-4 rounded-md border-[0.5px] p-8 shadow-xl',
	defaultVariants: {
		variant: 'fixed',
	},
	variants: {
		variant: {
			centered: 'top-1/2 -translate-y-1/2',
			fixed: 'top-[16vh]',
		},
	},
});
export type DialogVariant = VariantProps<typeof dialogVariants>['variant'];

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;

import Title from './dialog-title.svelte';
import Portal from './dialog-portal.svelte';
import Footer from './dialog-footer.svelte';
import Header from './dialog-header.svelte';
import Overlay from './dialog-overlay.svelte';
import Content from './dialog-content.svelte';

import Description from './dialog-description.svelte';
import Close from './dialog-close.svelte';
import type { VariantProps} from 'tailwind-variants';
import { tv } from 'tailwind-variants';

export {
	Root,
	Title,
	Close,
	Portal,
	Footer,
	Header,
	Trigger,
	Overlay,
	Content,
	Description,
	//
	Root as Dialog,
	Title as DialogTitle,
	Portal as DialogPortal,
	Footer as DialogFooter,
	Header as DialogHeader,
	Trigger as DialogTrigger,
	Overlay as DialogOverlay,
	Content as DialogContent,
	Description as DialogDescription,
	Close as DialogClose,
};
