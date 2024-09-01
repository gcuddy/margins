<script lang="ts">
  type Props = {
    entry: {
      title?: string | null
      author?: string | null
      image?: string | null
      summary?: string | null
    }
  }
  import { Button } from "@margins/ui"

  let { entry }: Props = $props()
</script>

<div class="flex flex-col gap-4">
  <div class="flex gap-4">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold">{entry.title}</h1>
      <p class="text-grayA-11 text-sm">{entry.author}</p>
    </div>
    <div class="relative h-24 w-24 overflow-hidden rounded-lg border">
      <img
        class="z-[1] mx-auto h-24 rounded border bg-transparent object-contain shadow"
        src={entry.image}
        alt={entry.title}
      />
      <img
        class="object-tops absolute inset-0 z-0 aspect-square h-full w-full rounded-lg border object-cover opacity-25 shadow blur-xl"
        src={entry.image}
        alt={entry.title}
      />
    </div>
  </div>
  <div>
    <Button variant='surface'>Save</Button>
  </div>
  <div>
    <span class="uppercase text-grayA-11 rt-Text rt-r-size-1 tracking-wide">Summary</span>
    <p class="line-clamp-3 rt-Text rt-r-size-1">{entry.summary}</p>
  </div>
</div>
