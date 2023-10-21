<script>
	import { invalidateAll } from '$app/navigation';
	import { createCurrentListStore, setCurrentListContext } from '$lib/stores/currentList';

	export let data;

	$: console.log({ data });

	const currentList = createCurrentListStore();
	setCurrentListContext(currentList);

	const STALE_TIME = 1000 * 60 * 5; // 5 minutes
	let lastFetch = 0;

	// function handleFocus() {
	// 	console.log("handleFocus")
	// 	if (Date.now() - lastFetch > STALE_TIME) {
	// 		console.log("stale, refetching")
	// 		lastFetch = Date.now();
	// 		// how to be more selective here?
	// 		invalidateAll();
	// 		// invalidate("entries");
	// 	}
	// }
</script>

<slot />
