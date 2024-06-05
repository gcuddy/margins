<script lang="ts">
  import "./hover-card.css"
  import { LinkPreview as HoverCardPrimitive } from "bits-ui"
  import { flyAndScale } from "@margins/lib"
  import { hoverCardContent } from "./index.js"
  import { applyWidth, type WidthProps } from "../../variants/width.variants.js"

  type $$Props = HoverCardPrimitive.ContentProps & WidthProps

  let className: $$Props["class"] = undefined
  export let align: $$Props["align"] = "start"
  export let sideOffset: $$Props["sideOffset"] = 8
  export let transition: $$Props["transition"] = flyAndScale
  export let transitionConfig: $$Props["transitionConfig"] = undefined
  export let width: $$Props["width"] = undefined
  export let maxWidth: $$Props["maxWidth"] = "480px"
  export let minWidth: $$Props["minWidth"] = undefined

  export { className as class }
</script>

<HoverCardPrimitive.Content
  {transition}
  {transitionConfig}
  {sideOffset}
  {align}
  collisionPadding={10}
  class={hoverCardContent({
    className,
    width: !!width,
    maxWidth: !!maxWidth,
    minWidth: !!minWidth,
  })}
  style={applyWidth({ width, maxWidth, minWidth })}
  {...$$restProps}
>
  <slot />
</HoverCardPrimitive.Content>
