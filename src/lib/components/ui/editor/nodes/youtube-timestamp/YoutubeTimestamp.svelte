<script lang="ts">
	import { page } from '$app/stores';
	import player from '$lib/stores/player';
	import { cn } from '$lib/utils/tailwind';
	import type { NodeViewProps } from '@tiptap/core';
	import toast from 'svelte-french-toast';
	import { NodeViewWrapper } from 'svelte-tiptap';
	import TimestampToast from './TimestampToast.svelte';

	export let node: NodeViewProps['node'];
	// export let updateAttributes: NodeViewProps['updateAttributes'];
	export let selected: NodeViewProps['selected'] = false;


	$: timestamp = Number(node.attrs.timestamp) < 3600 ? new Date(node.attrs.timestamp * 1000).toISOString().substring(14, 19) : new Date(node.attrs.timestamp * 1000).toISOString().substring(11, 19);

	function handleClick() {
		// if we're on the page...
		console.log("CLICKKKK");
		console.log($page.data.entry?.id, node.attrs.entry_id, $page.data.entry?.youtubeId, node.attrs.youtube_id, $player, $player?.type)
		if ($page.data.entry?.id == node.attrs.entry_id && $page.data.entry?.youtubeId == node.attrs.youtube_id && $player && $player.type === 'youtube') {
			$player.player.seekTo(node.attrs.timestamp, true);
			toast(TimestampToast)
		}
	}
</script>

<NodeViewWrapper
	as="span"
	class={cn('rounded w-fit', {
		ring: selected
	})}
>
	<button on:click={handleClick}>{timestamp}</button>
</NodeViewWrapper>

