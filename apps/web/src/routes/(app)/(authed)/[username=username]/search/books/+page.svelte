<script lang="ts">
  import { SearchItunes, SearchOpenLibrary } from "@margins/api/src/schema"
  import { Button, Input } from "@margins/ui"
  import { Effect } from "effect"
  import { client } from "@margins/features/rpc"
  import { createQuery, keepPreviousData } from "@tanstack/svelte-query"
  import { writable, derived } from "svelte/store"
  export let data
  const value = writable("")

  $: value.set(data.q ?? "")

  // const query = createQuery(
  //   derived(value, $q => ({
  //     queryKey: ["itunesBookSearch", $q],
  //     queryFn: () =>
  //       Effect.runPromise(
  //         client(new SearchItunes({ term: $q, media: "ebook" })),
  //       ),
  //     placeholderData: keepPreviousData,
  //     enabled: !!$q,
  //   })),
  // )
  const query = createQuery(
    derived(value, $q => ({
      queryKey: ["bookSearch", $q],
      queryFn: () =>
        Effect.runPromise(client(new SearchOpenLibrary({ query: $q }))),
      placeholderData: keepPreviousData,
      enabled: !!$q,
    })),
  )

  $: ({ isLoading, data: results } = $query)
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

    {#each results.docs as result}
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
        {/each}
  {/if}
</div>
