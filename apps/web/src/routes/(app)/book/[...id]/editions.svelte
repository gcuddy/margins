<script lang="ts">
  import { type OpenLibraryKey } from "@margins/api/src/integrations/openlibrary"
  import { GetOpenLibraryBookEditions } from "@margins/api/src/schema"
  import { client } from "@margins/features/rpc"
  import { createQuery } from "@tanstack/svelte-query"
  import { Effect } from "effect"
  import { derived, writable } from "svelte/store"

  export let bookKey: OpenLibraryKey

  const bookKeyStore = writable(bookKey)

  $: bookKeyStore.set(bookKey)

  //   TODO: rewrite to svelte 5;

  const query = createQuery(
    derived(bookKeyStore, $bookKey => ({
      queryKey: ["bookEditions", $bookKey],
      queryFn: () =>
        Effect.runPromise(
          client(
            new GetOpenLibraryBookEditions({
              key: $bookKey,
            }),
          ).pipe(Effect.tapError(Effect.logError)),
        ),
    })),
  )

  $: ({ data: editions, error, isError, isLoading } = $query)
</script>

<div class="">
  {#if isLoading}
    <p>Loading...</p>
  {:else if isError}
    <p>Error: {error?.message}</p>
  {:else if editions}
    <ul class="list-none">
      {#each editions.entries as edition}
        <li>{edition.title}</li>
        {JSON.stringify(edition)}
      {/each}
    </ul>
  {/if}
</div>
