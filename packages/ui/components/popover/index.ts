import { Popover as PopoverPrimitive } from 'bits-ui';
import Content from './popover-content.svelte';
import { tv } from 'tailwind-variants';
import { panel } from '../../styles/tailwind.js';
const Root = PopoverPrimitive.Root;
const Trigger = PopoverPrimitive.Trigger;
const Close = PopoverPrimitive.Close;

const popoverVariants = tv({
  extend: panel,
  base: "m-PopperContent relative z-50 overflow-auto rounded-lg p-4 outline-none",
})

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
