<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import { createTabsContext, type Tabs } from './utils';
	import type { Maybe } from '$lib/utils/type-utils';
	import TabsContent from './TabsContent.svelte';
	import TabsList from './TabsList.svelte';
	import TabsTrigger from './TabsTrigger.svelte';
	import type { CreateTabsProps } from '@melt-ui/svelte';

	type RootProvided = {
		root: Tabs['root'];
	};
	type NoRootProvided = {
		root?: undefined;
		opts?: CreateTabsProps;
	};

	type Props = RootProvided | NoRootProvided;
	type $$Props = HTMLBaseAttributes & Props;

	let className: Maybe<string> = '';
	export { className as class };

    // Could alternatively allow passing in of entire createtabs() and then that gets passed into context
	export let opts: CreateTabsProps | undefined = undefined;
	export let root: Tabs['root'] = createTabsContext(opts).root;


	// Should allow root to passed in, or nothing but optionally opts and we handle it internally with context
</script>

<div melt={$root} class={cn(className)} {...$$restProps}>
	<slot {TabsContent} {TabsList} {TabsTrigger} />
	<!--  -->
</div>

<!-- <TabGroup on:change {...$$restProps}>
	<slot />
	<TabPanels let:selectedIndex>
		<slot name="panels" {selectedIndex} />
	</TabPanels>
</TabGroup> -->
