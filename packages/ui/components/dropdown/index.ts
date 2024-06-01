import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
import Item from './dropdown-menu-item.svelte';
import ChevronDown from '../icons/chevron-down.svelte';
import Label from './dropdown-menu-label.svelte';
import Content from './dropdown-menu-content.svelte';
import Shortcut from './dropdown-menu-shortcut.svelte';
import RadioItem from './dropdown-menu-radio-item.svelte';
import Separator from './dropdown-menu-separator.svelte';
import RadioGroup from './dropdown-menu-radio-group.svelte';
import SubContent from './dropdown-menu-sub-content.svelte';
import SubTrigger from './dropdown-menu-sub-trigger.svelte';
import CheckboxItem from './dropdown-menu-checkbox-item.svelte';
import Icon from './dropdown-menu-icon.svelte';
import { tv } from 'tailwind-variants';
import { baseMenu } from '../base-menu.js';

const Sub = DropdownMenuPrimitive.Sub;
const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Group = DropdownMenuPrimitive.Group;

const triggerVariants = tv({
	base: 'hover:bg-glass/5 data-[state=open]:bg-glass/5 flex cursor-default items-center gap-2 rounded-lg p-1.5',
	defaultVariants: {},
});

export const dropdownContent = tv({
	extend: baseMenu,
	base: ['group/dropdown z-50 min-w-[8rem] rounded-lg focus:outline-none'],
	variants: {
		size: {
			sm: 'p-1',
			md: 'p-2',
			lg: 'p-3',
		},
	},
	defaultVariants: {
		size: 'md',
	},
});

export const dropdownItem = tv({
	base: [
		'group/dropdown-item relative flex cursor-default select-none items-center rounded-sm px-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:text-white data-[disabled]:opacity-50 group-data-[size=md]/dropdown:h-8 group-data-[size=md]/dropdown:px-3',
	],
	variants: {
		inset: {
			true: 'pl-8',
		},
	},
});

export {
	Sub,
	Root,
	Item,
	Label,
	Group,
	Trigger,
	Content,
	Shortcut,
	Separator,
	RadioItem,
	SubContent,
	SubTrigger,
	RadioGroup,
	CheckboxItem,
	Icon,
	triggerVariants,
	//
	ChevronDown as TriggerIcon,
	Root as DropdownMenu,
	Sub as DropdownMenuSub,
	Item as DropdownMenuItem,
	Label as DropdownMenuLabel,
	Group as DropdownMenuGroup,
	Content as DropdownMenuContent,
	Trigger as DropdownMenuTrigger,
	Shortcut as DropdownMenuShortcut,
	RadioItem as DropdownMenuRadioItem,
	Separator as DropdownMenuSeparator,
	RadioGroup as DropdownMenuRadioGroup,
	SubContent as DropdownMenuSubContent,
	SubTrigger as DropdownMenuSubTrigger,
	CheckboxItem as DropdownMenuCheckboxItem,
	Icon as DropdownMenuIcon,
};
