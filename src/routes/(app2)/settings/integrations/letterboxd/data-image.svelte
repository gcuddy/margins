<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';

	import { cn } from '$lib';

	export let src: string;
	export let title: string;

	const {
		elements: { fallback, image },
		states: { loadingStatus },
	} = createAvatar({
		src,
	});
</script>

<div class="aspect-auto rounded-md shadow-lg w-16 h-24">
	<img
		use:melt={$image}
		class="aspect-auto w-min rounded-[inherit]"
		alt="Movie poster for {title}"
	/>
	<div
		class={cn(
			'bg-muted flex w-min items-center justify-center text-muted-foreground',
			$loadingStatus === 'loading' && 'animate-pulse',
		)}
		use:melt={$fallback}
	>
		<!--  -->
		{#if $loadingStatus === 'error'}
			{title}
		{/if}
	</div>
</div>
