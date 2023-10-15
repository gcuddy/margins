<script lang="ts">
    import type { PageData } from "./$types"
    export let item: PageData["collection"]["items"][number];

    import Textarea from "$components/ui/Textarea.svelte";

</script>

<div>

{item.entry?.title || item.annotation?.title || item.annotation?.body}

<Textarea bind:value={item.note} />

</div>