import { type VariantProps, tv } from "tailwind-variants"
import { createSizeVariant } from "../../variants/size.variants.js"
import { createVariantVariants } from "../../variants/variant.variants.js"
import SegmentedControlItem from "./segmented-control-item.svelte"
import SegmentedControlRoot from "./segmented-control-root.svelte"

export const segmentedControlVariants = tv({
  base: ["m-SegmentedControlRoot"],
  variants: {
    size: createSizeVariant(["sm", "md", "lg"]),
    variant: createVariantVariants(["surface", "classic"]),
  },
  defaultVariants: {
    size: "md",
    variant: "surface",
  },
  //  TODO: responsive
})

export type SegmentedControlProps = VariantProps<
  typeof segmentedControlVariants
>

export { SegmentedControlItem as Item, SegmentedControlRoot as Root }
