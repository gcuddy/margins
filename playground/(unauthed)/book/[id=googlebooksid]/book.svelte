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

<div class="mx-auto flex max-w-xl flex-col gap-6">
  <div class="flex gap-8 items-center">
    <div class="relative shrink-0 h-fit">
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
    <div class="flex flex-col gap-2">
      <span class="text-2xl font-bold tracking-tight">
        {book.volumeInfo.title}
      </span>
      {#if book.volumeInfo.subtitle}
        <span class="text-grayA-11 text-lg font-medium">
          {book.volumeInfo.subtitle}
        </span>
      {/if}

      <div class="text-grayA-11 flex items-center gap-2">
        <!-- {#if book.volumeInfo.publishedDate}
          <span class="">
            {new Date(book.volumeInfo.publishedDate).getFullYear()}
          </span>
        {/if} -->
        {#if book.volumeInfo.authors}
          <span class="">
            {book.volumeInfo.authors.join(", ")}
          </span>
        {/if}
      </div>
      <dl class="rt-DataListRoot rt-r-orientation-horizontal rt-r-size-2 rt-Text mt-2">
        {#if book.volumeInfo.publishedDate}
          <div class="rt-DataListItem">
            <dt class="rt-DataListLabel">Published</dt>
            <dd class="rt-DataListValue">
              {new Date(book.volumeInfo.publishedDate).getFullYear()}
            </dd>
          </div>
        {/if}
        {#if book.volumeInfo.publisher}
          <div class="rt-DataListItem">
            <dt class="rt-DataListLabel">Publisher</dt>
            <dd class="rt-DataListValue">
              {book.volumeInfo.publisher}
            </dd>
          </div>
        {/if}
        {#if book.volumeInfo.pageCount}
          <div class="rt-DataListItem">
            <dt class="rt-DataListLabel">Pages</dt>
            <dd class="rt-DataListValue">
              {book.volumeInfo.pageCount}
            </dd>
          </div>
        {/if}
        {#if book.volumeInfo.industryIdentifiers}
          <div class="rt-DataListItem">
            <dt class="rt-DataListLabel">ISBN</dt>
            <dd class="rt-DataListValue">
              {book.volumeInfo.industryIdentifiers?.find(
                id => id.type === "ISBN_13",
              )?.identifier ??
                book.volumeInfo.industryIdentifiers?.find(
                  id => id.type === "ISBN_10",
                )?.identifier ??
                "N/A"}
            </dd>
          </div>
        {/if}
      </dl>
    </div>
  </div>
  <div>
    <p class="text-grayA-11 max-w-prose">
      {@html book.volumeInfo.description}
    </p>
  </div>
</div>
