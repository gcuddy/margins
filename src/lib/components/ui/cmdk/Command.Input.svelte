<script lang="ts">
	import { useCommand, useState } from "./Command.Root.svelte";
	import type { HTMLInputAttributes } from "svelte/elements";

	// TODO

	interface InputProps extends HTMLInputAttributes {
		value?: string;
		onValueChange?: (value: string) => void;
	}
	// export let value: string | null = null;

	interface $$Props extends HTMLInputAttributes {}

	const context = useCommand();
	const state = useState();

	export let value = "";

	$: value, state.setState("search", value);
</script>

<input
	data-cmdk-input
	autocomplete="off"
	autocorrect="off"
	spellcheck="false"
	aria-autocomplete="list"
	role="combobox"
	aria-expanded="true"
	aria-controls={$context.listId}
	aria-labelledby={$context.labelId}
	id={$context.inputId}
	type="text"
	bind:value
	{...$$restProps}
/>
