<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { createReplicache, setReplicache } from "./replicache"
  import { createGet } from "@margins/features/replicache"
  import { PARTYKIT_HOST } from "$lib/env"
  import PartySocket from "partysocket"

  export let workspaceID: string
  export let token: string

  let conn: PartySocket | null = null

  // this could also happen in load function?
  const rep = createReplicache({
    token,
    workspaceID,
  })

  setReplicache(rep)

  onMount(() => {
    conn = new PartySocket({
      host: PARTYKIT_HOST,
      room: workspaceID,
    })
    conn.addEventListener("message", event => {
      if (event.data === "poke") {
        console.log("got poke, initiating pull")
        if (!rep) return
        rep.pull()
      }
    })
  })

  onDestroy(() => {
    conn?.close()
    rep.close()
  })

  const init = createGet(
    () => "/init",
    () => rep,
  )()
</script>

<svelte:window on:focus={() => rep.pull} />

{#if rep && $init}
  <slot />
{:else}
  <div class="grid h-screen w-screen place-items-center">Loading...</div>
{/if}
