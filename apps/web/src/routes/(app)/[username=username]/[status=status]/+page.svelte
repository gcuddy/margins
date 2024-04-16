<script lang="ts">
	import {
		ShellHeader,
		ShellContent,
		getShellCtx,
	} from '@margins/features/shell';
	import { LibraryStore } from '@margins/features/data';
	import { getReplicache } from '$lib/client/replicache';
	import { createId } from '@margins/lib';
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { Dropdown, SmallPlus } from '@margins/ui';
	import {
		locationToDisplay,
		locationToHrefs,
		locationToIcon,
		locations,
	} from '@margins/features/entries';
	export let data;

	const rep = getReplicache();
	const allBookmarks = LibraryStore.all.watch(
		() => rep,
		() => [],
	)();

	$: bookmarks = derived(allBookmarks, ($allBookmarks) => {
		return $allBookmarks.filter((b) => {
			return b.status === data.statusType && b.entry;
		});
	});

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

<ShellHeader>
	<Dropdown.Root>
		<Dropdown.Trigger class={Dropdown.triggerVariants()}>
			<svelte:component
				this={locationToIcon[data.statusType]}
				class="text-muted-foreground mr-1.5 h-4 w-4"
			/>
			<SmallPlus>
				{data.status}
			</SmallPlus>
		</Dropdown.Trigger>
		<Dropdown.Content align="start">
			{#each locations as location}
				<Dropdown.Item
					href="/u:{$page.data.user?.username}{locationToHrefs[location]}"
				>
					<Dropdown.Icon icon={locationToIcon[location]} />
					{locationToDisplay[location]}</Dropdown.Item
				>
			{/each}
		</Dropdown.Content>
	</Dropdown.Root>
</ShellHeader>

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
	<ul class="py-1">
		{#each $bookmarks as bookmark}
			<li>
				<!-- TODO: figure out if we should link to bookmark id or entry id...
                    bookmark id makes sense her ebut then entry id more generic so makes sense also
                -->
				<a
					href="/u:{$page.data.user?.username}/read/{bookmark.id}"
					class="mx-3 block h-14 cursor-default"
				>
					<!-- start of actual component -->
					<div class="flex items-center gap-3 rounded px-3">
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
