<script lang="ts">
	import Text from '$lib/ui/text.svelte';
	import { tv } from 'tailwind-variants';

	type Props = {
		image: string;
		title: string;
		author: string;
		class?: string;
	};

	let { image, title, author, class: className }: Props = $props();
	const root = tv({
		base: 'flex gap-3 items-center'
	});
</script>

<div class={root({ class: className })}>
	{#if image}
		<img src={image} class="w-8 h-9 object-cover rounded-1" alt={title} />
	{:else}
		<div class="w-8 h-9 rounded-1 bg-gray-3"></div>
	{/if}

	<div class="flex flex-col">
		<Text size="2" as="div" truncate>
			{title}
		</Text>
		<Text size="1" as="div" color="gray" truncate>
			{author}
		</Text>
	</div>
</div>
