<script lang="ts">
  // import { SearchItunes, SearchOpenLibrary } from "@margins/api/src/schema"
  import { Button, Input } from "@margins/ui"
  import { Effect } from "effect"
  import { client } from "$lib/client/rpc-client.js"
  import { createQuery, keepPreviousData } from "@tanstack/svelte-query"
  import { GoogleBooksSearch } from "@margins/api/src/request.js"

  const { data } = $props()

  const query = createQuery(() => ({
    queryKey: ["bookSearch", data.q],
    queryFn: () =>
      Effect.runPromise(
        client(new GoogleBooksSearch({ query: data.q ?? "" })).pipe(
          Effect.withRequestBatching(false),
          Effect.tapErrorCause(error =>
            Effect.logError("rpc request error", error),
          ),
        ),
      ),
    placeholderData: keepPreviousData,
    enabled: !!data.q,
    retry: false,
  }))

  // $effect(() => {
  //   console.log({ query })
  // })

  const { isLoading, data: results } = query
</script>

<div class="p-4">
  <form class="flex items-center">
    <Input placeholder="Search books" name="q" />
    <!-- Clicking this should trigger a search in openlibrary -->
    <Button type="submit">Search</Button>
  </form>
  {#if isLoading}
    Loading...
  {:else if results}
    {#each results.items ?? [] as result}
      <div>
        <a href={result.volumeInfo.infoLink} rel="noreferrer">
          {result.volumeInfo.title}
        </a>
      </div>
    {/each}
    <!-- <div>
      {#each results.results as result}
        <a
          href="/book/it/{result.trackId}"
          target="_blank"
          rel="noreferrer"
          class="mb-4 flex items-center"
        >
          <img
            src={result.artworkUrl100}
            alt={result.trackName}
            class="mr-4 h-24 w-16"
          />
          <div>
            <h3 class="font-serif font-bold">{result.trackName}</h3>
            <p>By {result.artistName}</p>
            <p>{result.formattedPrice}</p>
          </div>
        </a>
      {/each}
    </div> -->

    <!-- {#each results.docs as result}
          <a href="/book{result.key}" class="mb-4 flex items-center">
            <img
              src={result.cover_i
                ? `https://covers.openlibrary.org/b/id/${result.cover_i}-M.jpg`
                : ""}
              alt={result.title}
              class="mr-4 h-24 w-16"
            />
            <div>
              <h3 class="font-serif font-bold">{result.title}</h3>
              <p>
                {result.author_name
                  ? `By ${result.author_name.join(", ")}`
                  : ""}
              </p>
              <p>{result.first_publish_year}</p>
            </div>
          </a>
        {/each} -->
  {/if}
</div>
