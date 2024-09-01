<script lang="ts">
  import { OpenLibraryKey } from "@margins/api/src/integrations/openlibrary.js"
  import { GetOpenLibraryBook } from "@margins/api/src/schema.js"
  import autoAnimate from "@formkit/auto-animate"

  import { client } from "$lib/client/rpc-client.js"
  import { Button, Command, Popover } from "@margins/ui"
  import { createQuery } from "@tanstack/svelte-query"
  import { Effect } from "effect"
  import { derived, writable } from "svelte/store"
  import Author from "./author.svelte"
  import Editions from "./editions.svelte"
  import Editor from "$lib/client/editor/editor.svelte"
  export let data

  // todo: ssr this page
  // todo: put this stuff in more useful place
  const key = writable("")
  let showEditions = false
  let statusPopoverOpen = false

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

<div class="max-w-prose-long mx-auto mt-16 px-4">
  {#if isLoading}
    <p>Loading...</p>
  {:else if isError}
    <p>Error: {error?.message}</p>
  {:else if book}
    <div class="flex w-[76ch] flex-col">
      <div class="">
        <img
          src="https://covers.openlibrary.org/b/id/{book.covers?.[0]}-M.jpg"
          alt={book.title}
          class="ring-grayA-5 max-h-32 w-auto rounded shadow ring-1"
        />
      </div>
      <h1 class="mt-4 font-serif text-3xl font-bold">{book.title}</h1>
      <div class="flex items-center gap-x-2">
        {#each book.authors ?? [] as { author }}
          {@const key = author.key.replace(/^\/?authors\//, "")}
          {#if key}
            <Author authorKey={OpenLibraryKey(key)} />
          {/if}
        {/each}
        <span class="text-sm text-grayA-11 font-medium before:content-['•'] before:mr-2 before:text-xs">
          {book.first_publish_date}
        </span>
      </div>
    </div>
    {#if book.description}
      <p>
        {book.description}
      </p>
    {/if}
    <div
      class="my-4 grid grid-cols-[auto,minmax(0px,1fr)] items-center gap-x-4 gap-y-3"
    >
      <span class="text-grayA-11 text-xs font-medium"> Status </span>
      <div class="flex items-center">
        <Popover.Root bind:open={statusPopoverOpen}>
          <Popover.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              data-state={statusPopoverOpen ? "open" : "closed"}
              variant="ghost">Not in library</Button
            >
          </Popover.Trigger>
          <Popover.Content class="p-0">
            <Command.Root size="md">
              <Command.Input showIcon={false} placeholder="Set status" />
              <Command.Group>
                <Command.Item checkbox checked>Unsaved</Command.Item>
                <Command.Item checkbox>Backlog</Command.Item>
                <Command.Item checkbox>Now</Command.Item>
                <Command.Item checkbox>Archive</Command.Item>
              </Command.Group>
            </Command.Root>
          </Popover.Content>
        </Popover.Root>
      </div>
      <Button variant="ghost">+ Date</Button>
    </div>
    <!-- <Button>Save to Inbox</Button> -->
    <div
      class="mt-4 flex flex-col"
      use:autoAnimate={{
        duration: 125,
      }}
    >
      <div>
        <Button
          on:click={_ => (showEditions = !showEditions)}
          variant="ghost"
          class="text-grayA-11 text-sm font-medium">Editions</Button
        >
      </div>
      {#if showEditions}
        <!-- TODO: save editions -->
        <div>
          <Editions bookKey={OpenLibraryKey($key)} />
        </div>
      {/if}
      <div>
        <!-- {JSON.stringify(book)} -->
        Notes
        <!-- TODO: notes -->
        <Editor />
      </div>
    </div>
    <!-- TODO: save to now, save to archive -->
    <!-- <p>By {book.authors.join(", ")}</p> -->
    <!-- TODO: grab book covers and put in R2 -->
    <!-- <p>{book}</p> -->
  {/if}
</div>
