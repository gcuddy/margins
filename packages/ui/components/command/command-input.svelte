<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv"
  import MagnifyingGlass from "lucide-svelte/icons/search"
  import { cn } from "@margins/lib"

  type $$Props = CommandPrimitive.InputProps & {
    showIcon?: boolean
  }

  let className: string | undefined | null = undefined
  export { className as class }
  export let value: string = ""
  export let showIcon = true
</script>

<div class="flex items-center border-b px-3" data-cmdk-input-wrapper="">
  {#if showIcon}
    <MagnifyingGlass class="mr-2 h-4 w-4 shrink-0 opacity-50" />
  {/if}
  <CommandPrimitive.Input
    on:keydown
    class={cn(
      "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...$$restProps}
    bind:value
  />
</div>
