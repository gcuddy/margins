<script lang='ts'>
	import type { QueryInput } from "$lib/queries/query";
	import { readable } from "svelte/store";
    import List from '$components/entries/list.svelte'

    const opts = readable(
        {
            library: "subscriptions",
            status: null,
            sort: "published",
            dir: 'desc',
            filter: {
                seen: false,
            }
        } satisfies QueryInput<"get_library">
    );
</script>


<List {opts} />
