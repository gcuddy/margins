<script lang="ts">
  import { client } from "$lib/client/rpc-client"
  import { GoogleBooksGet } from "@margins/api/src/request.js"
  import { Effect } from "effect"
  import { createQuery } from "@tanstack/svelte-query"
  import Book from "./book.svelte"

  const { data } = $props()

  const query = createQuery(() => ({
    queryKey: ["book", data.id],
    queryFn: () =>
      Effect.runPromise(
        client(new GoogleBooksGet({ id: data.id })).pipe(
          Effect.withRequestBatching(true),
          Effect.tapErrorCause(error =>
            Effect.logError("rpc request error", error),
          ),
        ),
      ),
  }))
</script>

{#if query.isLoading}
  <p>Loading...</p>
{:else if query.isError}
  <p>Error: {query.error.message}</p>
{:else if query.data}
  <Book book={query.data} />
{/if}
