<!-- an attempt at my own version of this for svelte -->
<script lang="ts">
	import { persistQueryClient } from "@tanstack/query-persist-client-core";
	import type { PersistQueryClientOptions } from "@tanstack/query-persist-client-core";
	import { ComponentProps, onDestroy } from "svelte";
	import type { QueryClientProviderProps } from "@tanstack/svelte-query/build/lib/QueryClientProvider.svelte";
	import QueryClientProvider from "@tanstack/svelte-query/build/lib/QueryClientProvider.svelte";
	// import QueryClientProvider from "@tanstack/svelte-query";
	import type { QueryClient } from "@tanstack/svelte-query";

	export let persistOptions: Omit<PersistQueryClientOptions, "queryClient">;
	export let client: QueryClient;
    export let onSuccess: (() => void) | undefined = undefined;
	const [unsubscribe, promise] = persistQueryClient({
		...persistOptions,
		queryClient: client,
	});
    promise.then(() => {
        if (!isStale) {
            // TODO
            onSuccess?.();
            // set is restoring fale
        }
    });

    onDestroy(() => {
        isStale = true;
        unsubscribe();
    })

    let isStale = false;

</script>

<QueryClientProvider {client}>
    <!-- isRestoringProvider -->
    <slot />
</QueryClientProvider>
