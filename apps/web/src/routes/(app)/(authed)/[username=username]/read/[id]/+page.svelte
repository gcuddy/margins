<script lang="ts">
  import { getReplicache } from "$lib/client/replicache"
  import { LibraryStore, AnnotationStore } from "@margins/features/data"
  import { ShellContent, ShellHeader } from "@margins/features/shell"
  import {
    Article,
    EntryHeader,
    EntryInspector,
    EntryProvider,
  } from "@margins/features/entries"
  import { mainCommandState } from "$lib/client/stores/command-state"
  import EntryCommands from "./entry-commands.svelte"
  const { data } = $props()

  const rep = getReplicache()
  const bookmark = LibraryStore.get.watch(
    () => rep,
    () => [data.id],
  )

  mainCommandState.registerComponent("entry", EntryCommands, {
    id: data.id,
  })

  const annotations = AnnotationStore.list.watch(
    () => rep,
    () => [],
    annotations =>
      bookmark.ready
        ? annotations.filter(a => {
            return a.entryId === bookmark.data.entry?.id
          })
        : [],
  )
  // $: console.log({ $annotations, $bookmark });
  // TODO: if no bookmark, show 404
</script>

<EntryProvider>
  <ShellHeader>
    {#if bookmark.ready}
      <EntryHeader
        entry={bookmark.data.entry}
        id={bookmark.data.id}
        title={bookmark.data.title ??
          bookmark.data.entry?.title ??
          "[no title]"}
      />
    {/if}
  </ShellHeader>
  {#if bookmark.ready}
    <ShellContent>
      <div class="flex grow items-stretch overflow-hidden">
        <Article annotations={annotations.data} bookmark={bookmark.data} />
        <EntryInspector
          annotations={annotations.data}
          bookmark={bookmark.data}
        />
      </div>
    </ShellContent>
  {/if}
</EntryProvider>
