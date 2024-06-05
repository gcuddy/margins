<script lang="ts">
  import { GetLink, URL } from "../../api/src/schema.js"
  export let link: string
  import { client } from "../rpc/rpc-client.js"
  import { Effect, Console } from "effect"

  const x = Effect.runPromise(
    client(
      new GetLink({
        url: URL(link),
      }),
    ).pipe(Effect.withRequestCaching(true)),
  )

  // these both work
  const a = fetch("http://localhost:3000/hello").then(res => res.text())
  // const x = fetch("http://localhost:3000/rpc", {
  //   method: "POST",
  // }).then(res => res.text())
</script>

<div class="flex flex-col gap-2">
  <a href={link} class="text-accent-foreground text-sm font-medium">
    {link}
  </a>
  <slot />
  {#await x then x} {JSON.stringify(x)} {/await}
  {#await a then x} {JSON.stringify(x)} {/await}
</div>
