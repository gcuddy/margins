import type { OpenLibraryKey } from "@margins/api/src/integrations/openlibrary"
import { GetOpenLibraryAuthor } from "@margins/api/src/schema"
import { client } from "@margins/features/rpc"
import { queryOptions } from "@tanstack/svelte-query"
import { Effect } from "effect"

export const openLibraryQueries = {
  author: (key: OpenLibraryKey) =>
    queryOptions({
      queryKey: ["bookAuthor", key],
      queryFn: () =>
        Effect.runPromise(
          client(
            new GetOpenLibraryAuthor({
              key: key,
            }),
          ).pipe(Effect.tapError(Effect.logError)),
        ),
    }),
}
