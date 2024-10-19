<script lang="ts">
	import { receive, send } from '$lib/transition';
	import Text from '$lib/ui/text.svelte';
	import type { Snippet } from 'svelte';
	import { tv } from 'tailwind-variants';

	type Props = {
		image?: Snippet;
		imageSrc?: string;
		title: string;
		author: string;
		href?: string;
		class?: string;
	};

	let { image, imageSrc, title, author, class: className, href }: Props = $props();
	const root = tv({
		base: 'flex gap-3 items-center hover:backdrop-brightness-[.98] dark:hover:backdrop-brightness-110'
	});
</script>

<svelte:element this={href ? 'a' : 'div'} {href} class={root({ class: className })}>
	{#if image}
		{@render image()}
	{:else if imageSrc}
		<img src={imageSrc} class="w-8 h-9 object-cover rounded-1" alt={title} />
	{:else}
		<div class="w-8 h-9 rounded-1 bg-gray-3"></div>
	{/if}

	<div class="flex flex-col" in:send={{ key: 'title' }} out:receive={{ key: 'title' }}>
		<Text size="2" as="div" truncate>
			{title}
		</Text>
		<Text size="1" as="div" color="gray" truncate>
			{author}
		</Text>
	</div>
</svelte:element>
