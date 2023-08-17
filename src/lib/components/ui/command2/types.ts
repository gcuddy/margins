import type { HTMLAttributes, HTMLInputAttributes } from 'svelte/elements';

type Unstyled = {
    unstyled?: boolean;
}

type HTMLDivAttributes = HTMLAttributes<HTMLDivElement>;
type DivProps = HTMLDivAttributes & Unstyled;

type InputProps = HTMLInputAttributes & Unstyled & {
    onKeydown?: (e: KeyboardEvent) => void;
}

type ElProps<T extends EventTarget> = HTMLAttributes<T> & Unstyled;

type AsChild = {
    asChild?: boolean;
}

type RootProps = HTMLDivAttributes & AsChild & Unstyled & {
    value?: string;
}

export type { InputProps, DivProps, RootProps, AsChild, ElProps };
