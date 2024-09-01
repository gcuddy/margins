import { Store } from "../replicache/store.svelte.js"
import type { Annotation as TAnnotation } from "../core/index.js"

export type Annotation = TAnnotation.Item

export const AnnotationStore = new Store()
  .$type<Annotation>()
  .scan("list", () => ["Annotation"])
  .get((id: string) => ["Annotation", id])
  .build()
