<script lang="ts">
	import type { Writable } from 'svelte/store';
	export let className = 'py-2';
	export let focus: Writable<number>;
	let div: HTMLDivElement;
</script>

<div
	bind:this={div}
	class="{className} text-sm "
	role="none"
	on:click
	on:mouseleave={() => {
		$focus = -1;
		div.focus();
	}}
>
	<div class="">
		<slot />
	</div>
</div>
