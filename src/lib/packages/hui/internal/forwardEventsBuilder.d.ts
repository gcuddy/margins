import type { SvelteComponent } from "svelte";
declare type ForwardException = string | {
    name: string;
    shouldExclude: () => boolean;
};
export declare function forwardEventsBuilder(component: SvelteComponent, except?: ForwardException[]): (node: HTMLElement | SVGElement) => {
    destroy: () => void;
};
export {};
