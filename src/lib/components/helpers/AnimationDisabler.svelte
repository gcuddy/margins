<script lang="ts">
	import { getContext, onDestroy, onMount, tick } from "svelte";
	import type { Writable } from "svelte/store";

	// Extremely simple component. Disables animation (via context) when mounted.
	const disable: Writable<boolean> = getContext("disableAnimation");
	if (!disable) {
		console.warn("<AnnotationDisabler /> used but no `disableAnimation` context found.");
	}
	$: console.log({ disable });
	onMount(() => {
		if (disable) {
			disable.set(true);
		}
	});
	onDestroy(async () => {
		// REVIEW: should set false?
		await tick();
		// disable.set(false);
	});
</script>

<slot />
