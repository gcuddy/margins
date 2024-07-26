<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query"
  import { derived } from "svelte/store"
  import { openLibraryQueries } from "../../queries.js"

  export let data
  const query = createQuery(
    derived(data.id, $id => openLibraryQueries.author($id)),
  )

</script>

{$query.data?.name}

{$query.data?.photos}
