<script lang="ts">
	// Designed to go inside main-shell
	import type { ComponentType } from 'svelte';
	export let title = '';
	export let icon: ComponentType | undefined = undefined;
</script>

<header
	class="flex min-h-14 max-w-[100vw] shrink-0 items-center justify-between gap-3 border-b-[0.5px] pl-6 pr-8"
>
	{#if title}
		<div class="flex items-center">
			{#if icon}
				<svelte:component
					this={icon}
					class="text-muted-foreground mr-1.5 h-4 w-4"
				/>
			{/if}
			<span class="text-sm font-medium">
				{title}
			</span>
		</div>
	{/if}
	<slot />
</header>
