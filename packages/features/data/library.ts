import type { Bookmark } from "@margins/db/kysely/types"
import type { Selectable } from "kysely"
import { Store } from "../replicache/store.svelte.js"
import type { Entry } from "../core/index.js"

export type BookmarkWithEntry = Selectable<Bookmark> & {
  entry: Entry.Item
}

export const LibraryStore = new Store()
  .$type<BookmarkWithEntry>()
  .scan("all", () => ["Bookmark"])
  .get((id: string) => ["Bookmark", id])
  .build()
