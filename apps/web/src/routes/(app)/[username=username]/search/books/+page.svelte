<script lang="ts">
  import { SearchBooks } from "@margins/api/src/schema"
  import { Button, Input } from "@margins/ui"
  import { Effect } from "effect"
  import { client } from "@margins/features/rpc"
  import debounce from "just-debounce-it"
  import { createQuery, keepPreviousData } from "@tanstack/svelte-query"
  import { writable, derived } from "svelte/store"

  let value = writable("")
  let showResults = false

  const debouncedSetValue = debounce((val: string) => value.set(val), 200)

  const query = createQuery(
    derived(value, $value => ({
      queryKey: ["bookSearch", $value],
      queryFn: () =>
        Effect.runPromise(client(new SearchBooks({ query: $value }))),
      placeholderData: keepPreviousData,
      enabled: !!$value,
    })),
  )

  $: ({ isLoading, data: results } = $query)

  //   const search = (value: string) =>
  //     Effect.runPromise(
  //       client(
  //         new SearchBooks({
  //           query: value,
  //         }),
  //       ).pipe(
  //         Effect.withRequestCaching(true),
  //         Effect.tapError(e => {
  //           return Effect.logError(e)
  //         }),
  //       ),
  //     )
</script>

<div class="p-4">
  <form on:submit|preventDefault class="flex items-center">
    <Input
      on:change={e => debouncedSetValue(e.currentTarget.value)}
      placeholder="Search books"
    />
    <!-- Clicking this should trigger a search in openlibrary -->
    <Button on:click={() => (showResults = true)}>Search</Button>
  </form>
  {#if showResults}
    {#if isLoading}
      Loading...
    {:else if results}
      <div>
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
      </div>
    {/if}
    <!-- {#await search(value)}
      Loading...
    {:then results}
      <div>
        {#each results.docs as result}
          <div class="mb-4 flex items-center">
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
          </div>
        {/each}
      </div>
    {/await} -->
  {/if}
</div>
