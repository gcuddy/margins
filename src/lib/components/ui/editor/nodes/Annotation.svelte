<script lang="ts">
	import { page } from '$app/stores';
	import Annotation from '$components/notebook/Annotation.svelte';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { cn } from '$lib/utils/tailwind';
	import type { NodeViewProps } from '@tiptap/core';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import { create_query } from '$lib/state/query-state';
	import { query } from '$lib/queries/query';
	import { Skeleton } from '$components/ui/skeleton';

	export let node: NodeViewProps['node'];
	// export let updateAttributes: NodeViewProps['updateAttributes'];
	export let selected: NodeViewProps['selected'] = false;

	const entry = create_query({
		key: `entry:${node.attrs.id}`,
		fn: async () => query($page, 'get_annotation', { id: node.attrs.id }),
		stale_time: 1000 * 60 * 5
	});
</script>

<NodeViewWrapper
	as="div"
	class={cn('rounded w-fit', {
		ring: selected
	})}
>
	{#if $entry.isLoading}
		<Skeleton class="h-6 w-full" />
	{:else if $entry.isSuccess}
	<div class='contents'>
		<Annotation annotation={$entry.data} />
	</div>
	{/if}
</NodeViewWrapper>

<style lang="postcss">
	div :global(img) {
		margin: 0;
	}

</style>
