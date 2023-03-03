<script lang="ts">
	import { checkIfKeyboardShortcutsAllowed } from "$lib/stores/keyboard";
	import { createEventDispatcher } from "svelte";
	import type { Writable } from "svelte/store";
	import { fly, slide } from "svelte/transition";
	import GenericInput from "../GenericInput.svelte";
	export let value: Writable<string>;
	export let display = false;
	let ref: HTMLInputElement;
	$: display, display && ref && ref.focus();
	const dispatch = createEventDispatcher<{
		active: boolean;
	}>();
	let active = false;
	$: active, dispatch("active", active);
</script>

<!-- listen for cmd+f -->
<svelte:window
	on:keydown={(e) => {
		if (e.key === "f" && e.metaKey) {
			if (!checkIfKeyboardShortcutsAllowed()) return;
			e.preventDefault();
			display = true;
		}
	}}
/>

{#if display}
	<div>
		<GenericInput
			placeholder="Filter..."
			bind:el={ref}
			on:focus
			on:blur
			on:focus={() => (active = true)}
			on:blur={() => (active = false)}
			on:keydown={(e) => {
				if (e.key === "Escape") {
					console.log("escape");
					if (!$value) {
						display = false;
					} else {
						$value = "";
					}
				}
			}}
			bind:value={$value}
		/>
	</div>
{/if}
