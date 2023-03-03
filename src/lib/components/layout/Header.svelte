<script lang="ts">
	import mq from "$lib/stores/mq";
	import { externalIsshowing, isShowing } from "../../../routes/(app)/Sidebar.svelte";

	let className = "";
	export { className as class };
</script>

<header
	class="relative flex min-h-[56px] max-w-full shrink-0 items-center border-b pl-4 pr-7 transition-opacity dark:border-gray-700 lg:px-7 {className}"
>
	<div class="flex items-center">
        {#if $mq.max_md || !$isShowing}
		<button on:click={() => {
            $externalIsshowing = !$externalIsshowing;
        }} class="flex items-center z-50 mr-5">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
                class="h-4 w-4 stroke-muted"
				><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg
			>
		</button>
        {/if}
	</div>
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
