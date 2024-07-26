<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv"
  import { cn } from "@margins/lib"
  import { Check } from "svelte-radix"

  type $$Props = CommandPrimitive.ItemProps & {
    checkbox?: boolean
    checked?: boolean
  }

  export let asChild = false

  let className: string | undefined | null = undefined
  export { className as class }
  export let checked: $$Props["checked"] = undefined
  export let checkbox: $$Props["checkbox"] = undefined
</script>

<CommandPrimitive.Item
  {asChild}
  class={cn(
    "m-BaseMenuItem",
    "font-medium",
    // 'group relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
    checkbox && "m-BaseMenuCheckboxItem",
    className,
  )}
  {...$$restProps}
  let:action
  let:attrs
>
  {#if checked}
    <div class="m-BaseMenuItemIndicator">
      <svg
        width="9"
        height="9"
        viewBox="0 0 9 9"
        fill="currentcolor"
        xmlns="http://www.w3.org/2000/svg"
        class="m-BaseMenuItemIndicatorIcon"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
        />
      </svg>
    </div>
  {/if}
  <slot {action} {attrs} />
</CommandPrimitive.Item>
