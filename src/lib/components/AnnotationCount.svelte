<script lang="ts">
	import Icon from './helpers/Icon.svelte';

	export let count: number;
	export let href: string | undefined = undefined;
	$: as = href ? 'a' : 'span';
</script>

<!-- todo: make dry -->
{#if as === 'a'}
	<a
		class="flex flex-row items-center justify-center space-x-1 rounded-full bg-amber-100 py-1 px-2"
		{href}
		sveltekit:prefetch
	>
		<Icon name="pencilSolid" className="h-4 w-4 fill-amber-900" />
		<span class="text-sm font-medium text-amber-900">{count}</span>
	</a>
{:else}
	<span
		class="flex flex-row items-center justify-center space-x-1 rounded-full bg-amber-100 py-0.5 px-2"
		{href}
	>
		<Icon name="pencilSolid" className="h-4 w-4 fill-amber-900" />
		<span class="text-sm font-medium text-amber-900">{count}</span>
	</span>
{/if}
