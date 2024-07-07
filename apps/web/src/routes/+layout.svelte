<script lang="ts">
  import "@fontsource-variable/crimson-pro"
  import { page } from "$app/stores"
  import "@margins/ui/styles/style.css"
  import { ModeWatcher } from "mode-watcher"
  import { setContext } from "svelte"
  import { browser } from "$app/environment"
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query"

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: browser,
      },
    },
  })

  const iconCtx = {
    size: "15",
  }
  setContext("iconCtx", iconCtx)
</script>

<ModeWatcher />
<svelte:head>
  <title>
    {$page.data.title || "Margins"}
  </title>
  {#if $page.data.description}
    <meta name="description" content={$page.data.description} />
  {/if}
</svelte:head>
<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
