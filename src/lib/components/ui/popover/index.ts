import { Popover as PopoverPrimitive } from "bits-ui";
import Content from "./popover-content.svelte";
const Root = PopoverPrimitive.Root;
const Trigger = PopoverPrimitive.Trigger;


const popoverVariants = cva(
	'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none '
);

export {
	Root,
	Content,
	Trigger,
	//
	Root as Popover,
	Content as PopoverContent,
	Trigger as PopoverTrigger,
	popoverVariants
};
