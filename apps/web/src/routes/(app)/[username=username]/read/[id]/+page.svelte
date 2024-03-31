<script lang="ts">
	import { getReplicache } from '$lib/client/replicache';
	import { LibraryStore } from '@margins/features/data';
	import { ShellContent, ShellHeader } from '@margins/features/shell';
	import { Article } from '@margins/features/entries';
	import { Breadcrumb } from '@margins/ui';
	export let data;

	const rep = getReplicache();
	const bookmark = LibraryStore.get.watch(
		() => rep,
		() => [data.id],
	)();

	// TODO: if no bookmark, show 404
</script>

<ShellHeader>
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<!-- <Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item> -->
			<!-- <Breadcrumb.Separator /> -->
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">Library</Breadcrumb.Link>
			</Breadcrumb.Item>
			<!-- TODO: make this component dumber -->
			{#if $bookmark}
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					{$bookmark.title ?? $bookmark.entry?.title}
				</Breadcrumb.Item>
			{/if}
		</Breadcrumb.List>
	</Breadcrumb.Root>
</ShellHeader>
{#if $bookmark}
	<ShellContent>
		<Article bookmark={$bookmark} />
	</ShellContent>
{/if}
