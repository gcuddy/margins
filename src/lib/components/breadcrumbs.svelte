<script lang="ts" context="module">
	export type PathFragment = {
		name: string;
		href?: string;
		loading?: boolean;
	};
	export type Path = Array<PathFragment | string>;
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import Skeleton from './ui/skeleton/skeleton.svelte';

	export let root: PathFragment = { name: 'margins', href: '/' };

	export let path: Path = [];
</script>

<div class="flex min-w-0 flex-1 items-center gap-1.5">
	<a
		href={root.href}
		class="font-semibold tracking-tight text-foreground/60 hover:text-foreground/100 focus:text-foreground/100"
		>{root.name}</a
	>
	{#each path as pathFragment, index}
		{@const normalizedPath =
			typeof pathFragment === 'string' ? { name: pathFragment } : pathFragment}
		<span class="text-muted-foreground">/</span>
		{#if !normalizedPath.loading}
			<svelte:element
				this={normalizedPath.href ? 'a' : 'span'}
				href={normalizedPath.href}
				class={cn(
					'font-semibold tracking-tight text-foreground/60',
					normalizedPath.href &&
						'hover:text-foreground/100 focus:text-foreground/100',
					index === path.length - 1 && 'text-foreground/100',
				)}
			>
				{normalizedPath.name}
			</svelte:element>
		{:else}
			<Skeleton class="h-4 w-16" />
		{/if}
	{/each}
</div>
