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
  $: console.log({ value }) 
</script>

<ToggleGroup.Root
  {value}
  onValueChange={v => {
    console.log({ v })
    if (v) {
      value = v
    } else {
      value = value;
    }
  }}
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
