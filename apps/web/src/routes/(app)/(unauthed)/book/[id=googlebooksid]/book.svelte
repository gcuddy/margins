<script lang="ts">
  import type {
    GoogleBookVolume,
    ImageLinks,
  } from "@margins/api/src/integrations/google-books/schema"

  type Props = {
    book: GoogleBookVolume
  }

  const { book }: Props = $props()

  // Function to get the highest quality image
  function getBestImage(imageLinks?: ImageLinks | null): string {
    if (!imageLinks) return "/placeholder-book.png"

    const preferredOrder = [
      // thumbnail usually exists
      "thumbnail",
      "large",
      "medium",
      "small",
      "smallThumbnail",
    ] as const
    for (const size of preferredOrder) {
      if (imageLinks[size]) {
        console.log({ size, image: imageLinks[size] })
        const url = new URL(imageLinks[size])
        url.protocol = "https"
        url.searchParams.set("zoom", "10")
        url.searchParams.delete("edge")
        console.log({ url: url.toString() })
        return url.toString().replace("https://", "https://")
      }
    }

    return "/placeholder-book.png"
  }
  console.log({ book })

  const bestImage = getBestImage(book.volumeInfo.imageLinks)
</script>

<div class="mx-auto flex max-w-lg flex-col gap-6">
  <div class="flex gap-8">
    <div class="relative">
      <img
        src={bestImage}
        alt={book.volumeInfo.title}
        class="relative z-[1] h-56 w-36 rounded-lg border object-cover shadow"
      />
      <img
        src={bestImage}
        alt={book.volumeInfo.title}
        class="absolute -bottom-2.5 left-5 z-0 h-56 w-36 object-cover opacity-50 blur-md dark:opacity-10 dark:blur-xl"
      />
    </div>
    <div class="flex flex-col gap-3 py-4">
      <span class="text-2xl font-bold tracking-tight">
        {book.volumeInfo.title}
      </span>
      {#if book.volumeInfo.subtitle}
        <span class="text-grayA-11 text-lg font-medium">
          {book.volumeInfo.subtitle}
        </span>
      {/if}

      <div class="text-grayA-11 flex items-center gap-2">
        {#if book.volumeInfo.publishedDate}
          <span class="">
            {new Date(book.volumeInfo.publishedDate).getFullYear()}
          </span>
        {/if}
        {#if book.volumeInfo.authors}
          <span class="">
            {book.volumeInfo.authors.join(", ")}
          </span>
        {/if}
      </div>
      <div class="text-grayA-11 flex flex-col gap-4">
        {#if book.volumeInfo.industryIdentifiers}
          <span class="">
            ISBN: {book.volumeInfo.industryIdentifiers?.find(
              id => id.type === "ISBN_13",
            )?.identifier ??
              book.volumeInfo.industryIdentifiers?.find(
                id => id.type === "ISBN_10",
              )?.identifier ??
              "N/A"}
          </span>
        {/if}
        {#if book.volumeInfo.pageCount}
          <span class="">
            {book.volumeInfo.pageCount} pages
          </span>
        {/if}
        {#if book.volumeInfo.publisher}
          <span class="">
            Publisher:
            {book.volumeInfo.publisher}
          </span>
        {/if}
      </div>
    </div>
  </div>
  <div>
    <p class="text-grayA-11 max-w-prose">
      {@html book.volumeInfo.description}
    </p>
  </div>
</div>
