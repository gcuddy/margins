<script lang="ts">
	import { getReplicache } from '$lib/client/replicache';
	import { LibraryStore } from '@margins/features/data';
	import {
		ShellContent,
		ShellHeader,
		getShellCtx,
	} from '@margins/features/shell';
	import { Article } from '@margins/features/entries';
	import { Breadcrumb } from '@margins/ui';
	export let data;

	const rep = getReplicache();
	const bookmark = LibraryStore.get.watch(
		() => rep,
		() => [data.id],
	)();

	const { entryContext } = getShellCtx();

	// TODO: if no bookmark, show 404
</script>

<ShellHeader>
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<!-- <Breadcrumb.Item>
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item> -->
			<!-- <Breadcrumb.Separator /> -->
			<!-- <Breadcrumb.Item>
				<Breadcrumb.Link href="/">Library</Breadcrumb.Link>
			</Breadcrumb.Item> -->
			<!-- TODO: make this component dumber -->
			{#each $entryContext.breadcrumbs as breadcrumb, i}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={breadcrumb.href}
						>{breadcrumb.text}</Breadcrumb.Link
					>
				</Breadcrumb.Item>
				{#if i !== $entryContext.breadcrumbs.length - 1}
					<Breadcrumb.Separator />
				{/if}
			{/each}
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
