<script lang="ts">
	import { tick } from "svelte";
	import type { HTMLBaseAttributes } from "svelte/elements";
	import { useState } from "./Command.Root.svelte";

	const state = useState();
	let render = false;

	$: tick().then(() => (render = $state.filtered.count === 0));
	interface $$Props extends HTMLBaseAttributes {}
</script>

{#if render}
	<div data-cmdk-empty role="presentation" {...$$props}>
		<slot />
	</div>
{/if}
