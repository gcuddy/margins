<script lang="ts">
  import { OpenLibraryKey } from "@margins/api/src/integrations/openlibrary.js"
  import { GetOpenLibraryBook } from "@margins/api/src/schema.js"
  import autoAnimate from "@formkit/auto-animate"

  import { client } from "@margins/features/rpc"
  import { Button } from "@margins/ui"
  import { createQuery } from "@tanstack/svelte-query"
  import { Effect } from "effect"
  import { derived, writable } from "svelte/store"
  import Author from "./author.svelte"
  import Editions from "./editions.svelte"
  import { fly } from "svelte/transition"
  export let data

  // todo: ssr this page
  // todo: put this stuff in more useful place
  const key = writable("")
  let showEditions = false

  $: key.set(data.bookId.replace(/^\/?works\//, ""))

  const query = createQuery(
    derived(key, $key => ({
      queryKey: ["book", $key],
      queryFn: () =>
        Effect.runPromise(
          client(
            new GetOpenLibraryBook({
              key: OpenLibraryKey($key),
            }),
          ).pipe(Effect.tapError(Effect.logError)),
        ),
    })),
  )
  $: console.log({
    $query,
    $key,
  })

  $: ({ data: book, error, isError, isLoading } = $query)
</script>

<div class="mx-auto mt-16 max-w-prose px-4" use:autoAnimate>
  {#if isLoading}
    <p>Loading...</p>
  {:else if isError}
    <p>Error: {error?.message}</p>
  {:else if book}
    <div class="flex flex-col">
      <div class="">
        <img
          src="https://covers.openlibrary.org/b/id/{book.covers?.[0]}-M.jpg"
          alt={book.title}
          class="ring-grayA-5 max-h-32 w-auto rounded shadow ring-1"
        />
      </div>
      <h1 class="mt-4 font-serif text-3xl font-bold">{book.title}</h1>
      <div class="flex">
        {#each book.authors ?? [] as { author }}
          {@const key = author.key.replace(/^\/?authors\//, "")}
          {#if key}
            <Author authorKey={OpenLibraryKey(key)} />
          {/if}
        {/each}
      </div>
    </div>
    {#if book.description}
      <p>
        {book.description}
      </p>
    {/if}
    <Button>Save to Inbox</Button>
    <div class="mt-4 flex flex-col">
      <div>
        <Button
          on:click={_ => (showEditions = !showEditions)}
          variant="ghost"
          class="text-grayA-11 text-sm font-medium">Editions</Button
        >
      </div>
      {#if showEditions}
        <div transition:fly>
          <Editions bookKey={OpenLibraryKey($key)} />
        </div>
      {/if}
    </div>
    <!-- TODO: save to now, save to archive -->
    <!-- <p>By {book.authors.join(", ")}</p> -->
    <!-- TODO: grab book covers and put in R2 -->
    <!-- <p>{book}</p> -->
    {JSON.stringify(book)}
  {/if}
</div>
