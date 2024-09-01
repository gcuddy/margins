<script lang="ts">
  import { type OpenLibraryKey } from "@margins/api/src/integrations/openlibrary"
  import { GetOpenLibraryBookEditions } from "@margins/api/src/schema"
  import { client } from "$lib/client/rpc-client.js"
  import { createQuery } from "@tanstack/svelte-query"
  import { Effect } from "effect"
  import { derived, writable } from "svelte/store"
  import {
    createRender,
    createTable,
    Render,
    Subscribe,
  } from "svelte-headless-table"
  import dayjs from "dayjs"
  import Text from "./text.svelte"

  export let bookKey: OpenLibraryKey

  const bookKeyStore = writable(bookKey)
  const offset = writable<number | undefined>(undefined)
    $: console.log({$offset})

  $: bookKeyStore.set(bookKey)

  //   TODO: rewrite to svelte 5;

  const query = createQuery(
    derived([bookKeyStore, offset], ([$bookKey, $offset]) => ({
      queryKey: ["bookEditions", $bookKey, $offset],
      queryFn: () =>
        Effect.runPromise(
          client(
            new GetOpenLibraryBookEditions({
              key: $bookKey,
              offset: $offset,
            }),
          ).pipe(Effect.tapError(Effect.logError)),
        ),
    })),
  )

  $: ({ error, isError, isLoading } = $query)

  const editions = derived(query, $query => $query.data?.entries ?? [])

  $: nextOffset = $query.data?.links?.next
    ? Number($query.data.links.next.match(/offset=(\d+)/)?.[1])
    : null

  $: prevOffset = $query.data?.links?.prev
    ? Number($query.data.links.prev.match(/offset=(\d+)/)?.[1])
    : null

  const table = createTable(editions, {
    // sort: addSort
  })

  const columns = table.createColumns([
    table.column({
      accessor: "title",
      header: "Title",
    }),
    table.column({
      accessor: e => e.isbn_13 ?? e.isbn_10 ?? "-",
      header: "ISBN",
      cell: ({ value }) =>
        createRender(Text, {
          label: value,
          class: "tabular-nums",
        }),
    }),
    table.column({
      accessor: e =>
        e.languages?.map(l => l.key.replace("/languages/", "")).join(", ") ??
        "-",
      header: "Language",
    }),
    table.column({
      accessor: "number_of_pages",
      header: "Pages",
    }),
    table.column({
      accessor: e => dayjs(e.publish_date).format("YYYY"),
      header: "Published",
    }),
    table.column({
      accessor: "publishers",
      header: "Publisher",
    }),
  ])

  const { headerRows, rows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns)
</script>

<div class="">
  {#if isLoading}
    <p>Loading...</p>
  {:else if isError}
    <p>Error: {error?.message}</p>
  {:else if editions}
    <table
      class="bg-grayA-2 ring-grayA-5 divide-y rounded-md text-sm ring-1 backdrop-blur-xl"
      {...$tableAttrs}
    >
      <thead class="bg-grayA-2">
        {#each $headerRows as headerRow (headerRow.id)}
          <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
            <tr {...rowAttrs}>
              {#each headerRow.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <th class="h-11 p-3 text-left text-sm font-medium" {...attrs}>
                    <Render of={cell.render()} />
                  </th>
                </Subscribe>
              {/each}
            </tr>
          </Subscribe>
        {/each}
      </thead>
      <tbody {...$tableBodyAttrs} class="divide-y">
        {#each $rows as row (row.id)}
          <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
            <tr class="" {...rowAttrs}>
              {#each row.cells as cell (cell.id)}
                <Subscribe attrs={cell.attrs()} let:attrs>
                  <td class="h-11 max-w-36 bg-black/0 p-3" {...attrs}>
                    <Render of={cell.render()} />
                  </td>
                </Subscribe>
              {/each}
            </tr>
          </Subscribe>
        {/each}
      </tbody>
    </table>
    <!-- {#if prevOffset}
      <button
        on:click={() => {
          offset.set(prevOffset)
        }}
      >
        prev
      </button>
    {/if}
    {#if nextOffset}
      <button
        on:click={() => {
          offset.set(nextOffset)
        }}
      >
        next
      </button>
    {/if} -->
    <!-- <ul class="list-none">
      {#each $editions as edition}
        <li>{edition.title}</li>
        {JSON.stringify(edition)}
        <table></table>
      {/each}
    </ul> -->
  {/if}
</div>
