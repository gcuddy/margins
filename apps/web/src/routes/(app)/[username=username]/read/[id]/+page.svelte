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
	export let data;

	const rep = getReplicache();
	$: bookmark = LibraryStore.get.watch(
		() => rep,
		() => [data.id],
	)();

	mainCommandState.register('entry', (filter) => {
		return [
			{
				action: () => {
					rep.mutate.bookmark_update({
						id: data.id,
						input: {
							status: 'Archive',
						},
					});
				},
				label: 'Move to Archive',
			},
		];
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
