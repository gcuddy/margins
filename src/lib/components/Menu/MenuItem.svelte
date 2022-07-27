<script lang="ts">
	import type { Writable } from 'svelte/store';

	import Icon from '../helpers/Icon.svelte';

	export let role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox' = 'menuitem';
	let checked: true | undefined = undefined;
	export let className = 'group flex w-full items-center gap-2 rounded-md p-1 px-2';
	// export let className = 'group flex items-center gap-2 w-full px-2 py-2 text-sm';
	export let focus: Writable<number>;
	export let id: number;
	let button: HTMLButtonElement;
	$: $focus, $focus === id ? button?.focus() : null;
	console.log({
		focus: $focus,
		id
	});
</script>

<button
	bind:this={button}
	{role}
	tabindex="-1"
	on:click
	aria-checked={checked}
	class="{className} {$focus === id ? 'bg-gray-600' : ''}"
	on:mouseenter={() => ($focus = id)}
>
	<slot name="icon" />
	<slot />
</button>
