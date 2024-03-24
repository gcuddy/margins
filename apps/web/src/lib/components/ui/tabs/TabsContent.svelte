<script lang="ts" context="module">
	export const tabContent =
		'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import { getTabsContext, type Tabs } from './utils';
	import type { Maybe } from '$lib/utils/type-utils';
	import { melt } from '@melt-ui/svelte';
	let className: Maybe<string> = '';
	export { className as class };

	interface $$Props extends HTMLBaseAttributes {
		content?: Tabs['elements']['content'];
		value: string;
	}
	export let content: Tabs['elements']['content'] = getTabsContext().elements.content;

	export let value: string;
</script>

<div use:melt={$content(value)} {...$$restProps} class={cn(tabContent, className)}>
	<slot />
</div>
