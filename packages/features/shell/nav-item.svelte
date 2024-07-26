<script lang="ts">
  import { cn } from "@margins/lib"
  import type { ComponentType } from "svelte"
  import { ChevronDown } from "svelte-radix"
  import { slide } from "svelte/transition"

  export let icon: ComponentType
  export let href: string
  export let isActive = false
  export let label: string
  export let children:
    | Array<{
        icon: ComponentType
        href: string
        isActive: boolean
        label: string
      }>
    | undefined = undefined

  let expanded = true
</script>

<div class="relative">
  <a
    class={cn(
      "hover:bg-sandA-3 group my-px flex w-full cursor-default items-center justify-start rounded-lg px-3 py-1.5 text-left text-[13px] font-medium",
      isActive && "bg-sandA-4 hover:bg-sandA-4 text-accent-foreground",
    )}
    {href}
  >
    <svelte:component
      this={icon}
      class={cn(
        "text-grayA-11 group-hover:text-grayA-12 mr-2.5 h-4 w-4",
        isActive && "text-grayA-12",
      )}
    />
    <slot>
      {label}
    </slot>
  </a>
  {#if !!children?.length}
    <button
      class="absolute bottom-0 right-2 top-0 cursor-default"
      on:click={() => (expanded = !expanded)}
    >
      <ChevronDown
        class={cn("transition", expanded ? "rotate-0" : "-rotate-90")}
      />
      <span class="sr-only">Close</span>
    </button>
  {/if}
</div>
{#if children}
  {#if expanded}
    <div transition:slide class="ml-4 border-l pl-2">
      {#each children as child}
        <svelte:self {...child} />
      {/each}
    </div>
  {/if}
{/if}
