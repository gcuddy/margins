<script lang="ts">
	import EntryIcon from '$components/entries/EntryIcon.svelte';
	import { cn } from '$lib/utils/tailwind';
	import type { NodeViewProps } from '@tiptap/core';
	import { NodeViewWrapper } from 'svelte-tiptap';

	export let node: NodeViewProps['node'];
	export let updateAttributes: NodeViewProps['updateAttributes'];
	export let selected: NodeViewProps['selected'] = false;
</script>

<NodeViewWrapper
	as="span"
	class={cn('rounded', {
		ring: selected,
	})}
>
	<span>
		<a
			href="/{node.attrs.type}/{node.attrs.id}"
			class="max-w-[30ch] space-x-1 bg-cyan-500/20"
		>
			<EntryIcon
				type={node.attrs.type || 'article'}
				class="relative inline h-4 w-4 align-middle"
			/>
			<span class="truncate leading-none">{node.attrs.title}</span>
		</a>
	</span>
</NodeViewWrapper>
