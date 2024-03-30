<script lang="ts">
	import { ShellHeader, ShellContent } from '@margins/features/shell';
	import Inbox from 'lucide-svelte/icons/inbox';
	import { LibraryStore } from '@margins/features/data';
	import { getReplicache } from '$lib/client/replicache';
	export let data;

	const rep = getReplicache();
	const bookmarks = LibraryStore.all.watch(
		() => rep,
		() => [],
	)();
	$: console.log({ $bookmarks });
</script>

<ShellHeader title={data.status} icon={Inbox}></ShellHeader>

<svelte:window
	on:paste={() => {
		navigator.clipboard.readText().then((text) => {
			console.log(text);
			rep.mutate.bookmark_create({
				status: 'Backlog',
				uri: text,
			});
		});
	}}
/>
<ShellContent>
	count: {JSON.stringify($bookmarks.length)}
	<ul>
		{#each $bookmarks as bookmark}
			<li>{bookmark.title ?? bookmark.entry.title}</li>
		{/each}
	</ul>
</ShellContent>
