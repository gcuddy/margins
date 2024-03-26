import type { HTMLBaseAttributes } from 'svelte/elements';
import type { ClassValue } from 'clsx';
import { cn } from './utils/tailwind';

export { cn };

// This type alias is to identify CSS classes within component props, which enables Tailwind IntelliSense
export type CssClasses = string;

export type SlotProp =
	| CssClasses
	| ({
			class?: CssClasses;
	  } & HTMLBaseAttributes);

export const slot_class = (slot: SlotProp): string => {
	if (typeof slot === 'string') {
		return slot;
	} else {
		return slot.class ?? '';
	}
};

// we use Record<string, any> instead of HTMLBaseAttributes to play nice with Svelte
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const slot_attrs = (slot: SlotProp): Record<string, any> => {
	if (typeof slot === 'string') {
		return {};
	} else {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { class: _, ...attrs } = slot;
		return attrs;
	}
};

export const compose_slot = (
	slot: SlotProp,
	...classes: ClassValue[]
): {
	class: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
} => {
	return {
		class: cn(...classes, slot_class(slot)),
		...slot_attrs(slot)
	};
};

// alias:
export { compose_slot as cs };
