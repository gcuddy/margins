<script lang="ts">
	import { page } from '$app/stores';
	import Annotation from '$components/notebook/Annotation.svelte';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { cn } from '$lib/utils/tailwind';
	import type { NodeViewProps } from '@tiptap/core';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { query } from '$lib/queries/query';
	import { Skeleton } from '$components/ui/skeleton';

	export let node: NodeViewProps['node'];
	// export let updateAttributes: NodeViewProps['updateAttributes'];
	export let selected: NodeViewProps['selected'] = false;

	const entry = createQuery({
		key: `entry:${node.attrs.id}`,
		fn: async () => query(page, 'get_annotation', { id: node.attrs.id }),
		staleTime: 1000 * 60 * 5,
	});
</script>

<NodeViewWrapper
	as="div"
	class={cn('w-fit rounded', {
		ring: selected,
	})}
>
	{#if $entry.isLoading}
		<Skeleton class="h-6 w-full" />
	{:else if $entry.isSuccess}
		<div class="contents">
			<Annotation annotation={$entry.data} />
		</div>
	{/if}
</NodeViewWrapper>

<style lang="postcss">
	div :global(img) {
		margin: 0;
	}
</style>
