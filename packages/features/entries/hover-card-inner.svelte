<script lang="ts">
  import { Button, Inset } from "@margins/ui"
  import { GetLink, SaveLink, URL } from "../../api/src/schema.js"
  export let link: string
  // import { client } from "../../../apps/web/src/lib/client/rpc-client.js"
  // import { Effect } from "effect"

  // $: saveLink = client(
  //   new SaveLink({
  //     url: URL(link),
  //   }),
  // )

  // $: console.log({ saveLink })

  // $: getLink = Effect.runPromise(
  //   client(
  //     new GetLink({
  //       url: URL(link),
  //     }),
  //   ).pipe(
  //     Effect.withRequestCaching(true),
  //     Effect.tapError(e => {
  //       return Effect.logError(e)
  //     }),
  //   ),
  // )
</script>

<!-- {#await getLink}
  <Inset
    className="animate-pulse not-prose pb-[--inset-padding-bottom] relative w-[384px]"
  >
    <div class="bg-gray-5 block h-48 w-full object-cover" />
  </Inset>
  <div class="flex flex-col gap-2">
    <span class="animate-skeleton h-10 w-full rounded-md"></span>
    <span class="animate-skeleton h-8 w-2/3 rounded-md"></span>
  </div>
{:then link}
  <Inset className="not-prose pb-[--inset-padding-bottom] relative">
    <img
      class="bg-gray-5 block h-48 w-full object-cover"
      src={link.image}
      alt=""
    />
  </Inset>
  <div class="flex flex-col gap-2">
    <span class="line-clamp-2 text-base font-bold leading-none"
      >{link.title}</span
    >
    <span class="text-grayA-11 line-clamp-2 text-sm leading-tight"
      >{link.description}</span
    >
    <Button
      size="lg"
      class="w-full"
      variant="soft"
      on:click={() => Effect.runPromise(saveLink)}
      >Save</Button
    >
  </div>
{/await} -->
