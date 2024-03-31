<script lang="ts">
	import {
		ShellHeader,
		ShellContent,
		getShellCtx,
	} from '@margins/features/shell';
	import Inbox from 'lucide-svelte/icons/inbox';
	import { LibraryStore } from '@margins/features/data';
	import { getReplicache } from '$lib/client/replicache';
	import { createId } from '@margins/lib';
	import { page } from '$app/stores';
	export let data;

	const rep = getReplicache();
	const bookmarks = LibraryStore.all.watch(
		() => rep,
		() => [],
	)();

	const { entryContext } = getShellCtx();

	$: {
		$entryContext.breadcrumbs = [
			{
				href: $page.url.pathname,
				text: data.status,
			},
		];
		$entryContext.currentList = $bookmarks;
	}
</script>

<ShellHeader title={data.status} icon={Inbox}></ShellHeader>

<svelte:window
	on:paste={() => {
		navigator.clipboard.readText().then((text) => {
			rep.mutate.bookmark_create({
				id: createId(),
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
			<li>
				<!-- TODO: figure out if we should link to bookmark id or entry id...
                    bookmark id makes sense her ebut then entry id more generic so makes sense also
                -->
				<a href="/u:{$page.data.user?.username}/read/{bookmark.id}">
					{bookmark.title ?? bookmark.entry?.title ?? bookmark.id}
					author: {bookmark.entry?.author}
					{bookmark.id}</a
				>
			</li>
		{/each}
	</ul>
</ShellContent>
