<script lang="ts">
	import { getReplicache } from '$lib/client/replicache';
	import { LibraryStore } from '@margins/features/data';
	import { ShellContent, ShellHeader } from '@margins/features/shell';
	import {
		Article,
		EntryHeader,
		EntryInspector,
		EntryProvider,
	} from '@margins/features/entries';
	import { mainCommandState } from '$lib/client/stores/command-state';
	import EntryCommands from './entry-commands.svelte';
	export let data;

	const rep = getReplicache();
	$: bookmark = LibraryStore.get.watch(
		() => rep,
		() => [data.id],
	)();

	mainCommandState.registerComponent('entry', EntryCommands, {
		id: data.id,
	});

	// TODO: if no bookmark, show 404
</script>

<EntryProvider>
	<ShellHeader>
		{#if $bookmark && $bookmark.entry}
			<EntryHeader
				entry={$bookmark.entry}
				id={$bookmark?.id}
				title={$bookmark?.title ?? $bookmark?.entry?.title ?? '[no title]'}
			/>
		{/if}
	</ShellHeader>
	{#if $bookmark}
		<ShellContent>
			<div class="flex grow items-stretch overflow-hidden">
				<Article bookmark={$bookmark} />
				<EntryInspector bookmark={$bookmark} />
			</div>
		</ShellContent>
	{/if}
</EntryProvider>
