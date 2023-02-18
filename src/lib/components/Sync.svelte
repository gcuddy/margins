<script lang="ts">

	import { syncStore } from '$lib/stores/sync';
	import { useIsFetching } from '@tanstack/svelte-query';
	import { onDestroy } from 'svelte';
	import Icon from './helpers/Icon.svelte';
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
</script>

<!-- TODO: on hover, tooltip of title and progress -->
<!-- TODO: a11y — progress -->

<Icon
	name="refresh"
	className="h-4 w-4 stroke-gray-700 dark:stroke-gray-200 stroke-2 opacity-0 transition {($syncStore.length || $fetching) &&
		'animate-spin !opacity-100'}"
/>
