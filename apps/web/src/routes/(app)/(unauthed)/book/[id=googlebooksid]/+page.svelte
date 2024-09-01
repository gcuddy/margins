<script lang="ts">
  import { client } from "$lib/client/rpc-client"
  import { GoogleBooksGet } from "@margins/api/src/request.js"
  import { Effect } from "effect"
  import { createQuery } from "@tanstack/svelte-query"
  import { Breadcrumb, Button } from "@margins/ui"
  import Book from "./book.svelte"
  import { ShellContent, ShellHeader, Inspector } from "@margins/features/shell"
  import { DefaultInspector } from "@margins/features/entries"

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

<ShellHeader>
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>Books</Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        {#if query.isLoading}
          Loading...
        {:else if query.data}
          <span>
            {query.data.volumeInfo.title}
            <span class="text-grayA-11 text-xs tabular-nums">
              ({query.data.volumeInfo.industryIdentifiers?.find(
                id => id.type === "ISBN_13",
              )?.identifier ??
                query.data.volumeInfo.industryIdentifiers?.find(
                  id => id.type === "ISBN_10",
                )?.identifier ??
                "N/A"})
            </span>
          </span>
        {/if}
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <Button size="sm" variant="surface">Add to library</Button>
</ShellHeader>
{#if query.isLoading}
  <p>Loading...</p>
{:else if query.isError}
  <p>Error: {query.error.message}</p>
{:else if query.data}
  <ShellContent>
    <div class="flex grow items-stretch overflow-hidden">
      <div class="flex grow flex-col pt-8">
        <Book book={query.data} />
      </div>
      <Inspector>
        <DefaultInspector
          entry={{
            title: query.data.volumeInfo.title,
            author: query.data.volumeInfo.authors?.[0] ?? "Unknown author",
            image:
              query.data.volumeInfo.imageLinks?.thumbnail?.replace('&edge=curl', '') ??
              "/placeholder-book.png",
            summary: query.data.volumeInfo.description,
          }}
        />
      </Inspector>
    </div>
  </ShellContent>
{/if}
