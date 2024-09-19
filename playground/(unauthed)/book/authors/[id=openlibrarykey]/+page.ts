import { OpenLibraryKey } from "@margins/api/src/integrations/openlibrary.js"
import { writable } from "svelte/store"

export function load({ params }) {
  return {
    id: writable(OpenLibraryKey(params.id)),
  }
}
