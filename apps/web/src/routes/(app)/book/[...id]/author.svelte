<script lang="ts">
  import type { OpenLibraryKey } from "@margins/api/src/integrations/openlibrary"
  import { GetOpenLibraryAuthor } from "@margins/api/src/schema"
  import { client } from "@margins/features/rpc"
  import { createQuery } from "@tanstack/svelte-query"
  import { Effect } from "effect"
  import { derived, writable } from "svelte/store"

  export let authorKey: OpenLibraryKey

  const authorKeyStore = writable(authorKey)

  $: authorKeyStore.set(authorKey)

  //   TODO: rewrite to svelte 5;

  const query = createQuery(
    derived(authorKeyStore, $authorKey => ({
      queryKey: ["bookAuthor", $authorKey],
      queryFn: () =>
        Effect.runPromise(
          client(
            new GetOpenLibraryAuthor({
              key: $authorKey,
            }),
          ).pipe(Effect.tapError(Effect.logError)),
        ),
    })),
  )

  $: console.log({
    $query,
    $authorKeyStore,
  })

  $: ({ data: author, error, isError, isLoading } = $query)
</script>

<div class="">
  {#if isLoading}
    <p>Loading...</p>
  {:else if isError}
    <p>Error: {error?.message}</p>
  {:else if author}
    <span class="text-grayA-11 text-sm font-medium">{author.name}</span>
  {/if}
</div>
