import { VariantProps, tv } from "tailwind-variants"
import Inset from "./inset.svelte"

export const insetVariants = tv({
  base: ["m-Inset"],
  variants: {
    clip: {
      "border-box": "m-clip-border-box",
      "padding-box": "m-clip-padding-box",
    },
    side: {
      top: "m-side-top",
      bottom: "m-side-bottom",
      left: "m-side-left",
      right: "m-side-right",
      all: "m-side-all",
    },
  },
  defaultVariants: {
    side: "top",
    clip: "border-box",
  },
})

export type InsetProps = VariantProps<typeof insetVariants>

export { Inset }
