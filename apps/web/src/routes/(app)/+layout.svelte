<script lang="ts">
  import { browser } from "$app/environment"
  import { page } from "$app/stores"
  import CommandMenu from "$lib/client/command-menu.svelte"
  import ReplicacheProvider from "$lib/client/replicache-provider.svelte"
  import { AppShell, MainShell } from "@margins/features/shell"
  export let data
  $: console.log({ $page })
</script>

<!-- TODO: essentially we're turning this into a spa, which might not be desirable... -->
{#if browser && data.user}
  <ReplicacheProvider workspaceID={data.user.id} token={data.session?.id}>
    <CommandMenu />
    <AppShell>
      <slot />
    </AppShell>
  </ReplicacheProvider>
{:else if $page.route.id?.includes("unauthed")}
  <div class="ml-2 p-2">
    <MainShell>
      <slot />
    </MainShell>
  </div>
{/if}
