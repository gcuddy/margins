<script lang="ts">
  import { getEntryCtx } from "./ctx.js"
  import { tweened } from "svelte/motion"
  import { SegmentedControl, SmallPlus, Textarea } from "@margins/ui"
  import { type BookmarkWithEntry } from "../data/library.js"
  import { getReplicache } from "../replicache/index.js"
  import { createId } from "@margins/lib"
  import { LocationsDropdown } from "./index.js"
  import SidebarAnnotation from "../notebook/sidebar-annotation.svelte"
  import type { Annotation } from "../core/index.js"
  import { InfoCircled, Pencil2 } from "svelte-radix"
  const rep = getReplicache()
  const { inspectorTab, inspectorWidth, isInspectorVisible } = getEntryCtx()
  const DURATION = 125

  export let bookmark: BookmarkWithEntry
  export let annotations: Annotation.Item[]

  const marginLeft = tweened(0, {
    duration: DURATION,
  })

  $: marginLeft.set($isInspectorVisible ? 0 : -$inspectorWidth)
</script>

{#if $isInspectorVisible}
  <div
    style:width="{$inspectorWidth}px"
    class="entry-inspector bg-background-elevation2 flex flex-col gap-y-4 border-l px-6 py-3.5"
  >
    <div>
      <SegmentedControl.Root bind:value={$inspectorTab} className="w-full">
        <SegmentedControl.Item value="properties">
          <div class="flex items-center gap-2">
            <InfoCircled />
            Details
          </div></SegmentedControl.Item
        >
        <SegmentedControl.Item value="notebook">
          <div class="flex items-center gap-2">
            <Pencil2 />
            Notebook
          </div></SegmentedControl.Item
        >
      </SegmentedControl.Root>
    </div>
    <div class="overflow-y-auto">
      {#if $inspectorTab === "properties"}
        <div class="flex flex-col gap-2">
          <SmallPlus mini muted>Properties</SmallPlus>
          <div class="flex items-center gap-2">
            <SmallPlus muted>Location</SmallPlus>
            <LocationsDropdown
              onSelect={status => {
                rep.mutate.bookmark_update({
                  id: bookmark.id,
                  input: {
                    status,
                  },
                })
              }}
              status={bookmark.status}
            />
          </div>
          <div>
            <SmallPlus muted>Saved</SmallPlus>
            <SmallPlus>{bookmark.bookmarked_at}</SmallPlus>
          </div>
        </div>
      {:else if $inspectorTab === "notebook"}
        <Textarea
          onSave={async value => {
            rep.mutate.annotation_create({
              body: value,
              entryId: bookmark.entry?.id,
              id: createId(),
            })
          }}
          placeholder="Add a note…"
          class="bg-background-elevation w-full"
        />
        <div class="mt-4 flex flex-col gap-2">
          {#each annotations as annotation}
            <SidebarAnnotation {annotation} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}
