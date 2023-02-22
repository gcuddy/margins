import { getContext } from "svelte";
import type { Readable } from "svelte/store";

export const containerRefContextKey = "entry__containerRef";
export function getContainerRefContext() {
   const ref = getContext(containerRefContextKey);
   if (!ref) {
      throw new Error("No article ref context found. Did you forget to wrap your component?");
   }
   return ref as Readable<HTMLElement | undefined>;
}
