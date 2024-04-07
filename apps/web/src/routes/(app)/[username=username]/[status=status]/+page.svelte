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

	$: console.log({ $bookmarks });

	function getDomain(url: string) {
		const match = url.match(/:\/\/(www\d?\.)?(.[^/:]+)/i);
		if (
			match != null &&
			match.length > 2 &&
			typeof match[2] === 'string' &&
			match[2].length > 0
		) {
			return match[2];
		} else {
			return null;
		}
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
		{#each $bookmarks.filter((b) => b.entry) as bookmark}
			<li>
				<!-- TODO: figure out if we should link to bookmark id or entry id...
                    bookmark id makes sense her ebut then entry id more generic so makes sense also
                -->
				<a
					href="/u:{$page.data.user?.username}/read/{bookmark.id}"
					class="mx-3 block h-14"
				>
					<!-- start of actual component -->
					<div class="flex gap-3 rounded px-3">
						<div>
							<img
								src={bookmark.entry?.image ??
									`https://icon.horse/icon/${getDomain(bookmark.entry?.uri ?? '') ?? 'margins'}`}
								alt={bookmark.entry?.title}
								class="h-6 w-6 rounded"
							/>
						</div>
						<div class="flex flex-col">
							<span class="text-sm">
								{bookmark.entry?.title}
							</span>
							{#if bookmark.entry?.summary}
								<span class="text-sm">
									{bookmark.entry?.summary}
								</span>
							{/if}
							{#if bookmark.entry?.author}
								<span class="text-muted-foreground text-sm">
									{bookmark.entry?.author}
								</span>
							{/if}
						</div>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</ShellContent>
