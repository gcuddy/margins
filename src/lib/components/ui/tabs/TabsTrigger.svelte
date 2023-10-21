<script lang="ts" context="module">
	export const tabTrigger = cva(
		'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
		{
			defaultVariants: {
				selected: true,
			},
			variants: {
				selected: {
					false: '',
					true: 'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
				},
			},
		},
	);
</script>

<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { cva } from 'class-variance-authority';
	import type { HTMLAttributes } from 'svelte/elements';

	import { cn } from '$lib/utils/tailwind';
	import type { Maybe } from '$lib/utils/type-utils';

	import { getTabsContext, type Tabs } from './utils';
	type $$Props = HTMLAttributes<HTMLButtonElement> & {
		disabled?: boolean;
		trigger?: Tabs['elements']['trigger'];
		value: string;
	};
	export let trigger: Tabs['elements']['trigger'] =
		getTabsContext().elements.trigger;
	export let value: string;
	export let disabled = false;
	let className: Maybe<string> = '';
	export { className as class };

	export let useSelectedState = true;
</script>

<button
	class={cn(
		tabTrigger({
			selected: useSelectedState,
		}),
		className,
	)}
	{...$$restProps}
	use:melt={$trigger({
		disabled,
		value,
	})}
>
	<!--  -->
	<slot />
</button>

<!-- <Tab
	draggable="false"
	class={({ selected }) => cn(tabTrigger({), $$props.class)}
	{...$$restProps}
>
	<slot />
</Tab> -->
