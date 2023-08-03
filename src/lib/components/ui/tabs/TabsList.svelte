<script lang="ts" context="module">
	export const tabList =
		'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground';
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { Maybe } from '$lib/utils/type-utils';
	import type { HTMLAttributes, HTMLBaseAttributes } from 'svelte/elements';
	import { getTabsContext, type Tabs } from './utils';
	import { melt } from '@melt-ui/svelte';
	let className: Maybe<string> = '';
	export { className as class };

	type $$Props = HTMLAttributes<HTMLDivElement> & {
		list?: Tabs['elements']['list'];
	};

	export let list: Tabs['elements']['list'] = getTabsContext().elements.list;
</script>

<div use:melt={$list} class={cn(tabList, className)}>
	<slot />
</div>
