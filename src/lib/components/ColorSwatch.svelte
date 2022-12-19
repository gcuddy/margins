<script lang="ts">
	import { colors, type Color } from '$lib/types/colors';
	export let color: Color;
	export let hex: string = '';
	export let className = '';
	export let bg = 'gray-900';
	// export let color: Color;
	// $: hex = colors[color];
	if (color === 'Amber') {
		className = 'bg-amber-500 ring-amber-500 shadow-amber-500';
	} else if (color === 'Blue') {
		className = 'bg-blue-500 ring-blue-500 shadow-blue-500';
	} else if (color === 'Green') {
		className = 'bg-green-500 ring-green-500 shadow-green-500';
	} else if (color === 'Indigo') {
		className = 'bg-indigo-500  ring-indigo-500 shadow-indigo-500';
	} else if (color === 'Red') {
		className = 'bg-red-500 ring-red-500 shadow-red-500';
	}
</script>

<button
	on:click
	aria-label={color}
	class="inline-flex focus-visible:outline-none focus-visible:ring-1"
>
	<div color={hex} class="flex h-[22px] w-[22px] rounded-full p-0.5 ">
		<div
			class="w-5 rounded-full ring-offset-1 ring-offset-gray-900 hover:shadow hover:ring-1 {className}"
		/>
	</div>
</button>
