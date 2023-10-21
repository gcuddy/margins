<script lang="ts">
	import { cn } from '$lib/utils';

	export let value = '';
	let className: string | null | undefined = undefined;
	export { className as class };
	export let hours = false;

	let input: HTMLInputElement;

	function handleFocus() {
		input.setSelectionRange(0, 2);
	}

	// $: value = Math.min(value)

	// if hours is true, no limit. if hours is false, make sure we're not above 59

	$: if (!hours) {
		const numValue = +value;
		console.log({ numValue });
		if (numValue > 59) {
			value = '59';
		} else if (numValue < 0) {
			value = '00';
		}
	}

	function handleKeypress(e: KeyboardEvent) {
		const previousValue = value;
		if (Number.isNaN(Number(e.key))) {
			console.log('NAN');
			e.preventDefault();
			value = previousValue;
			return;
		}
	}

	function handleBlur() {
		value = value.padStart(2, '0');
	}
</script>

<input
	class={cn('focus:ring rounded tabular-nums text-sm text-muted-foreground', className)}
	bind:this={input}
	on:focus={handleFocus}
	on:blur={handleBlur}
	on:keypress={handleKeypress}
	type="text"
	bind:value
/>
<style>
	input {
		border: 0;
		appearance: none;
		width: 2ch;
	}

	input::selection {
		@apply bg-blue-300;
	}
</style>
