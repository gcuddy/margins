import { colorVariant } from '../variants/color.variants.js';
import { panel } from '../styles/tailwind.js';
import { tv } from 'tailwind-variants';
import { createSizeVariant } from '../variants/size.variants.js';

export const baseMenu = tv({
  // TODO: solid
  base: [
    panel(),
    "m-BaseMenuContent base-menu box-border flex flex-col overflow-hidden",
  ],
  variants: {
    color: colorVariant,
    size: createSizeVariant(["sm", "md", "lg"]),
    variant: {
      soft: "m-variant-soft",
    },
  },
  defaultVariants: {
    variant: "soft",
    size: "md",
  },
})
