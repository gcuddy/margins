<script lang="ts">
	import { page } from '$app/stores';
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { query } from '$lib/queries/query';
	import { create_query } from '$lib/state/query-state';
	import { cn } from '$lib/utils/tailwind';
	import type { NodeViewProps } from '@tiptap/core';
	import cx from 'classnames';
	import { NodeViewWrapper } from 'svelte-tiptap';

	export let node: NodeViewProps['node'];
	export let updateAttributes: NodeViewProps['updateAttributes'];
	export let selected: NodeViewProps['selected'] = false;

	const handleClick = () => {
		updateAttributes({ count: node.attrs.count + 1 });
	};

	// TODO: get image, get hover

	const entry = create_query({
		key: `entry:${node.attrs.id}`,
		fn: async () => query($page, 'get_entry_deets', { id: node.attrs.id }),
		stale_time: 1000 * 60 * 5
	});

	import { createContextMenu } from '@melt-ui/svelte';

</script>

<NodeViewWrapper
	as="span"
	class={cn('rounded', {
		ring: selected
	})}
>
	<span>
		<a
			on:click|preventDefault
			href="/tests/{node.attrs.type}/{node.attrs.id}"
			class="max-w-[30ch] space-x-1 bg-cyan-500/20"
		>
			{#if !$entry.isSuccess}
				<EntryIcon
					type={node.attrs.type || 'article'}
					class="relative inline h-4 w-4 align-middle"
				/>
			{:else if $entry.data.image}
				{@const src = $entry.data.image.startsWith('/')
					? $page.data.S3_BUCKET_PREFIX + $entry.data.image.slice(1)
					: $entry.data.image}
				<img
					{src}
					alt=""
					class="relative -top-px m-0 inline aspect-square h-[.9em] w-[.9em] rounded-full object-cover align-middle"
				/>
			{/if}
			<span class="truncate leading-none">{node.attrs.title}</span>
		</a>
	</span>
</NodeViewWrapper>
