import type { SvelteComponent } from "svelte";
declare const components: readonly ["a", "address", "article", "aside", "b", "bdi", "bdo", "blockquote", "button", "cite", "code", "data", "datalist", "dd", "dl", "dt", "div", "em", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "i", "input", "label", "li", "main", "nav", "ol", "p", "section", "span", "strong", "ul"];
export declare type SupportedElement = typeof components[number];
export declare type SupportedAs = SupportedElement | typeof SvelteComponent;
export declare function isValidElement(element: SupportedAs): boolean;
export {};
