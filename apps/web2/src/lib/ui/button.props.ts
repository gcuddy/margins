import type { AttributeProps, ChildProp } from '$lib/utils/types';
import type { HTMLAttributes } from 'svelte/elements';
import { tv, type VariantProps } from 'tailwind-variants';

const soft_ghost = tv({
  base: ['text-accent-11a [&.high-contrast]:accent-12', 'disabled:text-gray-8a disabled:bg-gray-3a']
});
export const baseButton = tv({
  base: [
    'inline-flex items-center justify-center shrink-0 select-none align-top font-default not-italic text-center data-[loading=true]:relative disabled:[--spiner-opacity:1]'
  ],
  variants: {
    variant: {
      soft: [
        soft_ghost(),
        'bg-accent-3a',
        'focus-visible:outline-2 outline-accent-8 -outline-offset-1',
        'hover:bg-accent-4a active:[&:not([data-state=open])]:bg-accent-5a disabled:text-gray-8a disabled:bg-gray-3a'
      ],
      ghost: [
        'box-content h-fit',
        soft_ghost(),
        'hover:bg-accent-3a',
        'focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus-8',
        'data-[state=open]:accent-3a active:[not:[data-state=open]]:bg-accent-4a',
        'disabled:text-gray-8a bg-transparent'
      ]
    },
    size: {
      '1': 'rounded-1 [--base-button-height:theme(spacing.5)]',
      '2': 'rounded-2 [--base-button-height:theme(spacing.6)]',
      '3': 'rounded-3 [--base-button-height:theme(spacing.7)]',
      '4': 'rounded-4 [--base-button-height:theme(spacing.8)]'
    }
  }
});

export type BaseButtonProps = VariantProps<typeof baseButton>;

export interface BaseButtonSvelteProps extends BaseButtonProps, HTMLAttributes<HTMLButtonElement> {
  color?: AccentColor;
}

export const iconButton = tv({
  extend: baseButton,
  base: ['h-[--base-button-height] w-[--base-button-height]'],
  variants: {
    variant: {
      ghost: 'h-[unset] w-[unset]'
    }
  },
  compoundVariants: [
    {
      variant: 'ghost',
      size: '1',
      class: 'p-1 -m-1'
    },
    {
      variant: 'ghost',
      size: '2',
      class: 'p-1.5 -m-1.5'
    },
    {
      variant: 'ghost',
      size: '3',
      class: 'p-2 -m-2'
    },
    {
      variant: 'ghost',
      size: '4',
      class: 'p-3 -m-3'
    }
  ],
  defaultVariants: {
    size: '2',
    variant: 'soft'
  }
});

export type IconButtonProps = VariantProps<typeof iconButton>;
export interface IconButtonSvelteProps extends IconButtonProps, HTMLAttributes<HTMLButtonElement>, ChildProp<AttributeProps> {
  color?: AccentColor;
}
