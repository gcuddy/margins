import type { Snippet } from 'svelte';

export type PropsWithChildren<Props, Parameters extends unknown[] = unknown[]> = Props & {
  children: Snippet<Parameters>;
};

export type ChildProp<Props extends Record<string, unknown>> = {
  child?: Snippet<[{ props: Props }]>;
}

export type AttributeProps = {
  class: string;
  'data-accent-color'?: AccentColor;
};
