<script lang="ts">
	import { getReplicache } from '$lib/client/replicache';
	import { LibraryStore } from '@margins/features/data';
	import { ShellContent, ShellHeader } from '@margins/features/shell';
	import { Article } from '@margins/features/entries';
	export let data;

	const rep = getReplicache();
	const bookmark = LibraryStore.get.watch(
		() => rep,
		() => [data.id],
	)();

	// TODO: if no bookmark, show 404
</script>

<ShellHeader>Entry</ShellHeader>
{#if $bookmark}
	<ShellContent>
		<Article bookmark={$bookmark} />
	</ShellContent>
{/if}
