<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { useCommand, useState } from './Command.Root.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { afterNavigate } from '$app/navigation';

	// TODO

	interface InputProps extends HTMLInputAttributes {
		value?: string;
		onValueChange?: (value: string) => void;
	}
	// export let value: string | null = null;

	interface $$Props extends HTMLInputAttributes {}

	const context = useCommand();
	const state = useState();

	export let value = '';

	let ref: HTMLElement;
	$: value, state.setState('search', value);

	async function focus() {
		await tick();
		ref.focus();
	}
	onMount(focus);

	afterNavigate((nav) => {
		// this is a hack to get it to focus after form submissions too
		console.log({ nav });
		focus();
	});
</script>

<input
	autofocus
	data-sveltekit-keepfocus
	bind:this={ref}
	data-cmdk-input
	autocomplete="off"
	autocorrect="off"
	spellcheck="false"
	aria-autocomplete="list"
	role="combobox"
	aria-activedescendant={$state.active_id}
	aria-expanded="true"
	aria-controls={$context.listId}
	aria-labelledby={$context.labelId}
	id={$context.inputId}
	type="text"
	bind:value
	{...$$restProps}
/>
