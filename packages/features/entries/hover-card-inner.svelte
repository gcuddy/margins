<script lang="ts">
  import { Button, Inset } from "@margins/ui"
  import { GetLink, URL } from "../../api/src/schema.js"
  export let link: string
  import { client } from "../rpc/rpc-client.js"
  import { Effect } from "effect"

  const x = Effect.runPromise(
    client(
      new GetLink({
        url: URL(link),
      }),
    ).pipe(
      Effect.withRequestCaching(true),
    ),
  )
</script>

{#await x}
  Loading...
{:then x}
  <Inset className="not-prose pb-[--inset-padding-bottom] relative">
    <img
      class="bg-gray-5 block h-48 w-full object-cover"
      src={x.image}
      alt=""
    />
  </Inset>
  <div class="flex flex-col gap-2">
    <span class="line-clamp-2 text-base font-bold leading-none">{x.title}</span>
    <span class="text-grayA-11 line-clamp-2 text-sm leading-tight"
      >{x.description}</span
    >
    <Button size="lg" class="w-full" variant="soft">Save</Button>
  </div>
{/await}
