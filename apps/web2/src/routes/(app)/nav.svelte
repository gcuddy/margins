<script lang="ts">
	import IconButton from '$lib/ui/icon-button.svelte';
	import Text from '$lib/ui/text.svelte';
	import { MagnifyingGlass, Plus, Archive } from 'svelte-radix';
	import { tv } from 'tailwind-variants';
	import type { Component, SvelteComponent } from 'svelte';

	const item = tv({
		base: [
            'group/item flex items-center gap-2',
            'hover:bg-gray-3 px-2 py-2 rounded-2',
        ]
	});
</script>

{#snippet navItem({ text, href, icon }: { text: string; href: string; icon: typeof Archive })}
	<Text size="2">
		{#snippet child({ props })}
			<a {...props} class={item({ className: props.class })} {href}>
				<svelte:component this={icon} class="size-4 text-gray-11a group-hover/item:text-gray-12" />
				{text}</a
			>
		{/snippet}
	</Text>
{/snippet}

<nav class="my-2 ml-2">
	<div class="h-12 flex justify-between gap-2 items-center pl-2 pr-4">
		<span class="shrink truncate">User / workspace here</span>
		<div class="flex items-center gap-2">
			<IconButton size="1" variant="ghost">
				<MagnifyingGlass class="size-4" />
			</IconButton>
			<IconButton size="1">
				<Plus class="size-4" />
			</IconButton>
		</div>
	</div>
	<div class="flex flex-col mt-2 pl-2 pr-4">
		{@render navItem({ text: 'Library', href: '/stream', icon: Archive })}
	</div>
</nav>
