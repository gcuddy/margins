<script lang="ts">
  import { tweened } from "svelte/motion"
	import { persisted } from 'svelte-local-storage-store';
  import type { Snippet } from "svelte";


  let { children }: {
    children: Snippet
  } = $props()

  const DURATION = 125

  const inspectorWidth = persisted("rightInspectorWidth", 300)
  const isInspectorVisible = persisted("rightInspectorVisible", false)

  const marginLeft = tweened(0, {
    duration: DURATION,
  })

  $effect(() => {
    marginLeft.set($isInspectorVisible ? 0 : -$inspectorWidth)
  })
</script>

{#if $isInspectorVisible}
  <div
    style:width="{$inspectorWidth}px"
    class="entry-inspector bg-background-elevation2 flex flex-col gap-y-4 border-l px-6 py-3.5"
  >
    {@render children()}
  </div>
{/if}
