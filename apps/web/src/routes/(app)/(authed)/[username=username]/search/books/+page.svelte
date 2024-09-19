<script lang="ts">
  // import { SearchItunes, SearchOpenLibrary } from "@margins/api/src/schema"
  import { Button, Input } from "@margins/ui"
  import { createQuery, keepPreviousData } from "@tanstack/svelte-query"
  // import { GoogleBooksSearch } from "@margins/api/src/request.js"

  const { data } = $props()

  const query = createQuery(() => ({
    queryKey: ["bookSearch", data.q],
    queryFn: async () => [],
    // Effect.runPromise(
    //   client(new GoogleBooksSearch({ query: data.q ?? "" })).pipe(
    //     Effect.withRequestBatching(true),
    //     Effect.tapErrorCause(error =>
    //       Effect.logError("rpc request error", error),
    //     ),
    //   ),
    // ),
    placeholderData: keepPreviousData,
    enabled: !!data.q,
    retry: false,
  }))

  // $effect(() => {
  //   console.log({ query })
  // })
</script>

<div class="p-4">
  <form class="flex items-center">
    <Input placeholder="Search books" name="q" />
    <!-- Clicking this should trigger a search in openlibrary -->
    <Button type="submit">Search</Button>
  </form>
  {#if query.isLoading}
    Loading...
  {:else if query.data}
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each query.data.items ?? [] as result}
        <div class="flex items-start space-x-4 rounded-lg border p-4 shadow-sm">
          <div class="relative">
            <img
              src={result.volumeInfo.imageLinks?.thumbnail?.replace(
                "&edge=curl",
                "",
              ) ?? "/placeholder-book.png"}
              alt={result.volumeInfo.title}
              class="relative z-[1] h-36 w-24 rounded-lg border object-cover shadow"
            />
            <img
              src={result.volumeInfo.imageLinks?.thumbnail?.replace(
                "&edge=curl",
                "",
              ) ?? "/placeholder-book.png"}
              alt={result.volumeInfo.title}
              class="absolute -bottom-1 left-2 z-0 h-36 w-24 object-cover opacity-50 blur-md"
            />
          </div>
          <div>
            <h3 class="font-serif text-lg font-bold">
              <a href={`/book/gb_${result.id}`}>
                {result.volumeInfo.title}
              </a>
            </h3>
            <p class="text-sm text-gray-600">
              {#if result.volumeInfo.authors}
                By {result.volumeInfo.authors.join(", ")}
              {/if}
            </p>
            <p class="text-sm text-gray-500">
              {result.volumeInfo.publishedDate
                ? new Date(result.volumeInfo.publishedDate).getFullYear()
                : "N/A"}
            </p>
            <p class="text-sm text-gray-500">
              ISBN: {result.volumeInfo.industryIdentifiers?.find(
                id => id.type === "ISBN_13",
              )?.identifier ??
                result.volumeInfo.industryIdentifiers?.find(
                  id => id.type === "ISBN_10",
                )?.identifier ??
                "N/A"}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
