<script>
	import { page } from '$app/stores';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
</script>

<div class="container mx-auto pt-16">
	<div class="mx-auto flex max-w-2xl flex-col gap-3 space-y-2">
		<div>
			{#if $page.data.title}
				<h1 class="text-2xl font-medium">{$page.data.title}</h1>
			{/if}
			{#if $page.data.subtitle}
				<SmallPlus color="muted">{$page.data.subtitle}</SmallPlus>
			{/if}
		</div>
		<div class="mt-6 border-t border-gray-500 dark:border-gray-700" />
		<slot />
	</div>
</div>
