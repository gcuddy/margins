import { tv } from "tailwind-variants";

const sizes = ['1', '2', '3'] as const;
const variants = ['classic', 'surface', 'soft'] as const;

const textFieldRoot = tv({
  base: [
    'flex items-stretch font-default font-normal not-italic text-start',
    'has-[.rt-TextFieldInput:focus]:out'
  ],
  variants: {
    size: {
      '1': [],
      '2': [],
      '3': []
    },
    variant: {
      classic: [],
      surface: [],
      soft: []
    }
  }
})
