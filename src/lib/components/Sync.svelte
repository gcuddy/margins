<script lang="ts">
	import { syncStore } from "$lib/stores/sync";
	import { useIsFetching, useIsMutating } from "@tanstack/svelte-query";
	import { onDestroy } from "svelte";
	import Icon from "./helpers/Icon.svelte";
	// let navigating_id: string | undefined;
	// const unsubscribeNavigating = navigating.subscribe((nav) => {
	// 	if (nav) {
	// 		navigating_id = syncStore.add();
	// 	} else if (navigating_id) {
	// 		syncStore.remove(navigating_id);
	// 		navigating_id = undefined;
	// 	}
	// });
	onDestroy(() => {
		// unsubscribeNavigating();
	});

	const fetching = useIsFetching();
	const mutating = useIsMutating();

	let mouseover = false;
</script>

<!-- TODO: on hover, tooltip of title and progress -->
<!-- TODO: a11y — progress -->
<!-- $fetching - removing it for now since i only want to see when mutating -->
<div
	on:mouseover={() => (mouseover = true)}
	on:focus={() => (mouseover = true)}
	on:blur={() => (mouseover = false)}
	on:mouseleave={() => (mouseover = false)}
>
	<Icon
		name="refresh"
		className="h-4 w-4 stroke-gray-700 dark:stroke-gray-200 stroke-2 opacity-0 transition {($syncStore.length ||
			$mutating) &&
			'animate-spin !opacity-100'}"
	/>
	{#if mouseover}
		<div
			class="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-gray-100 opacity-90 dark:bg-gray-700"
		>
			<div class="flex flex-col items-center justify-center space-y-2">
				<Icon
					name="refresh"
					className="h-4 w-4 stroke-gray-700 dark:stroke-gray-200 stroke-2 opacity-0 transition {($syncStore.length ||
						$mutating) &&
						'animate-spin !opacity-100'}"
				/>
				<div class="text-xs text-gray-700 dark:text-gray-200">
					{#if $syncStore.length}
						{$syncStore.length} pending
                        <!--TODO: maybe just mutating  -->
					{:else if $fetching}
						{$fetching} Fetching...
					{:else if $mutating}
						Saving...
					{:else}
						Synced
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
