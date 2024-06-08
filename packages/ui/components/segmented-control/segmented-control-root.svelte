<script lang="ts">
  import { ToggleGroup } from "bits-ui"
  import {
    segmentedControlVariants,
    type SegmentedControlProps,
  } from "./index.js"
  export let value: string
  export let className = ""
  export let size: SegmentedControlProps["size"] = "md"
  export let variant: SegmentedControlProps["variant"] = "surface"
</script>

<ToggleGroup.Root
  bind:value
  type="single"
  class={segmentedControlVariants({
    className,
    size,
    variant,
  })}
>
  <slot />
  <div class="m-SegmentedControlIndicator" />
</ToggleGroup.Root>
