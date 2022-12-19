<script lang="ts">
	import Icon from './helpers/Icon.svelte';

	export let count: number;
	export let href: string | undefined = undefined;
	$: as = href ? 'a' : 'span';
	export let el: HTMLElement | undefined = undefined;
</script>

<!-- todo: make dry -->
{#if as === 'a'}
	<a
		bind:this={el}
		class="flex w-10 shrink flex-row items-center justify-center space-x-1 rounded-full bg-amber-100 bg-gradient-to-br from-amber-100 to-amber-200 py-1 px-2"
		{href}
	>
		<Icon name="pencilSolid" className="h-3 w-3 fill-amber-900" />
		<span class="text-xs font-medium text-amber-900">{count}</span>
	</a>
{:else}
	<span
		bind:this={el}
		class="flex w-10 shrink flex-row items-center justify-center space-x-1 rounded-full bg-amber-100 bg-gradient-to-br from-amber-100 to-amber-200 py-0.5 px-2"
		{href}
	>
		<Icon name="pencilSolid" className="h-3 w-3 fill-amber-900" />
		<span class="text-xs font-medium text-amber-900">{count}</span>
	</span>
{/if}
