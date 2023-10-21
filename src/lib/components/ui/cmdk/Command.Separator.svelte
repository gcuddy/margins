<script lang="ts">
	/**
	 * A visual and semantic separator between items or groups.
	 * Visible when the search query is empty or `alwaysRender` is true, hidden otherwise.
	 */
	import { useState } from "./Command.Root.svelte";
	import type { HTMLBaseAttributes } from "svelte/elements";

	const state = useState();
	$: render = !$state.search;
	export let alwaysRender = false;
	interface $$Props extends HTMLBaseAttributes {
		alwaysRender?: boolean;
	}

	$: console.log({ $$props });
</script>

{#if render || alwaysRender}
	<div {...$$props} data-cmdk-separator role="separator" />
{/if}
