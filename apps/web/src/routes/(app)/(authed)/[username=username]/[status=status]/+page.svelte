<script lang="ts">
  import {
    ShellHeader,
    ShellContent,
    // getShellCtx,
  } from "@margins/features/shell"
  import { LibraryStore } from "@margins/features/data"
  import { getReplicache } from "$lib/client/replicache"
  import { createId } from "@margins/lib"
  import { page } from "$app/stores"
  // import { derived } from 'svelte/store';
  import { EntryItem, LocationsDropdown } from "@margins/features/entries"
  const { data } = $props()

  const rep = getReplicache()
  const bookmarks = LibraryStore.all.watch(
    () => rep,
    () => [],
    bookmarks =>
      bookmarks.filter(
        b => b.status === data.statusType && b.entry && b.entry.title,
      ),
  )

  $effect(() => {
    console.log("bookamrks data", bookmarks.data)
    console.log({ bookmarks })
  })

  // const { entryContext } = getShellCtx();

  // $: {
  // 	$entryContext.breadcrumbs = [
  // 		{
  // 			href: $page.url.pathname,
  // 			text: data.status,
  // 		},
  // 	];
  // 	$entryContext.currentList = $bookmarks;
  // }
</script>

<ShellHeader>
  <LocationsDropdown
    showAll
    status={data.statusType}
    variant="ghost"
    color="gray"
  />
</ShellHeader>

<svelte:window
  on:paste={() => {
    navigator.clipboard.readText().then(text => {
      rep.mutate.bookmark_create({
        id: createId(),
        status: "Backlog",
        uri: text,
      })
    })
  }}
/>
<ShellContent>
  <ul class="overflow-y-auto py-1">
    {#each bookmarks.data as bookmark}
      <li>
        <EntryItem user={$page.data.user} {bookmark} />
      </li>
    {/each}
  </ul>
</ShellContent>
