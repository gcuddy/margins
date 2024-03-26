<script lang="ts">
	import { page } from '$app/stores';
	import { tabList } from '$lib/components/ui/tabs/TabsList.svelte';
	import { tabTrigger } from '$lib/components/ui/tabs/TabsTrigger.svelte';
	import { cn } from '$lib/utils/tailwind';

	type Tab = {
		name: string;
		href: string;
	};
	let className = '';
	export { className as class };
	export let tabs: Tab[];
	let selected_fn = (tab: Tab) => $page.url.pathname === tab.href;

	let selected_tab = tabs[0];
	$: $page.url, selected_tab = tabs.find(selected_fn) ?? tabs[0];
	export { selected_fn as selected };
</script>

<!-- TODO: aria stuff -->
<div role="tablist" class={cn(tabList, className)} data-sveltekit-keepfocus>
	<!--  -->
	{#each tabs as { name, href }}
	{@const selected = name === selected_tab.name}
		<a
			{href}
			class={tabTrigger({
				selected
			})}
			data-sveltekit-replacestate
		>
			<slot tab={{ name, href }} name="trigger">
				{name}
			</slot>
		</a>
	{/each}
</div>
