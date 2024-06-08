<script lang="ts">
  import "./inset.css"
  import { insetVariants, type InsetProps } from "./index.js"
  export let side: InsetProps["side"] = "top"
  export let clip: InsetProps["clip"] = "padding-box"
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
