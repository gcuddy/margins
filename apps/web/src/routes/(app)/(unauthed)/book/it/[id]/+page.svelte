<script lang="ts">
  import { Lookup } from "@margins/api/src/integrations/itunes.js"
  import { client } from "@margins/features/rpc"
  import { createQuery } from "@tanstack/svelte-query"
  import { Effect } from "effect"
  import { derived, writable } from "svelte/store"
  import { Button, Command, Popover } from "@margins/ui"

  export let data
  const key = writable<number>()
  let statusPopoverOpen = false

  $: key.set(Number(data.bookId))

  const query = createQuery(
    derived(key, $key => ({
      queryKey: ["book", $key],
      enabled: !!$key,
      queryFn: () =>
        Effect.runPromise(
          client(
            new Lookup({
              id: $key,
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
    <div>Loading...</div>
  {:else if isError && error}
    <div>Error: {error.message}</div>
  {:else if book}
    <div class="flex w-[76ch] flex-col">
      <div class="">
        <img
          src={book.artworkUrl100}
          alt=""
          class="ring-grayA-5 max-h-32 w-auto rounded shadow ring-1"
        />
      </div>
      <h1 class="mt-4 font-serif text-3xl font-bold">{book.trackName}</h1>
      <div class="flex items-center gap-x-2">
        <span class="text-grayA-11 text-sm font-medium">
          {book.artistName}
        </span>
        <span
          class="text-grayA-11 text-sm font-medium before:mr-2 before:text-xs before:content-['•']"
        >
          {book.releaseDate}
        </span>
      </div>
    </div>
    {#if book.description}
      <p>
        {@html book.description}
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
  {/if}
</div>
