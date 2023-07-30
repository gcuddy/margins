<script lang="ts" context="module">
	export const tabTrigger = cva(
		'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm'
	);
</script>

<script lang="ts">
	import { Tab } from '@rgossiaux/svelte-headlessui';
	import { cn } from '$lib/utils/tailwind';
	import type { HTMLAttributes, HTMLBaseAttributes } from 'svelte/elements';
	import type { ComponentProps } from 'svelte';
	import { VariantProps, cva } from 'class-variance-authority';
	import { getTabsContext, type Tabs } from './utils';
	import type { TabsTriggerProps } from '@melt-ui/svelte';
	import type { Maybe } from '$lib/utils/type-utils';
	type $$Props = HTMLAttributes<HTMLButtonElement> & {
		trigger?: Tabs['trigger'];
		value: string;
		disabled?: boolean;
	};
	export let trigger: Tabs['trigger'] = getTabsContext().trigger;
	export let value: string;
	export let disabled = false;
	let className: Maybe<string> = '';
	export { className as class };
</script>

<button
	class={cn(tabTrigger(), className)}
	{...$$restProps}
	melt={$trigger({
		value,
		disabled
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
