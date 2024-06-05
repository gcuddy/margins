<script lang="ts">
  import "./inset.css"
  import { insetVariants, type VariantProps } from "./index.js"
  export let side: VariantProps["side"] = "top"
  export let clip: VariantProps["clip"] = "padding-box"
  export let className: string | null | undefined = undefined
</script>

<div class={insetVariants({ className, clip, side })}>
  <slot />
</div>

<style>
  div {
    box-sizing: border-box;
  }
</style>
