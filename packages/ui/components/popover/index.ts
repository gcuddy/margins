import { Popover as PopoverPrimitive } from 'bits-ui';
import Content from './popover-content.svelte';
import { tv } from 'tailwind-variants';
const Root = PopoverPrimitive.Root;
const Trigger = PopoverPrimitive.Trigger;
const Close = PopoverPrimitive.Close;

const popoverVariants = tv({
	base: 'bg-popover text-popover-foreground z-50 w-72 rounded-lg border p-4 shadow-md outline-none',
});

export {
	Root,
	Content,
	Trigger,
	Close,
	//
	Root as Popover,
	Content as PopoverContent,
	Trigger as PopoverTrigger,
	Close as PopoverClose,
	popoverVariants,
};
