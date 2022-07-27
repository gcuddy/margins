<script lang="ts">
	import { headerComponent } from '$lib/stores/header';

	import { onDestroy } from 'svelte';
	import { component_subscribe } from 'svelte/internal';

	$: console.log({ $$slots });
	let className = '';
	export { className as class };

	$: className = $headerComponent.props?.class ?? '';

	$: console.log({ $headerComponent });
</script>

<header
	class="relative flex min-h-[56px] max-w-full shrink-0 items-center border-b pl-14 pr-7 transition-opacity dark:border-gray-750 lg:px-7 {className}"
>
	<slot />
	<!-- {#if typeof $headerComponent.header === 'string'}
		{@html $headerComponent.header}
	{:else if $headerComponent.header.component}
		<svelte:component
			this={$headerComponent.header.component}
			{...$headerComponent.header?.props ?? {}}
		/>
	{/if} -->
</header>
