<script lang="ts">
	import { cn } from '$lib/utils';
	import Header from './ui/Header.svelte';
	import { Button } from './ui/button';
	export let path: Array<
		| {
				name: string;
				href?: string;
		  }
		| string
	> = [];
</script>

<Header>
	<div class="flex min-w-0 flex-1 items-center gap-1.5">
		<a
			href="/"
			class="font-semibold tracking-tight text-foreground/60 hover:text-foreground/100 focus:text-foreground/100"
			>margins</a
		>
		{#each path as pathFragment, index}
			{@const normalizedPath =
				typeof pathFragment === 'string'
					? { name: pathFragment }
					: pathFragment}
			<span class="text-muted-foreground">/</span>
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
		{/each}
	</div>
	<div class="flex w-auto items-center justify-end">
        <Button href="/login" variant="ghost">
            Login or Sign Up
        </Button>
</Header>
