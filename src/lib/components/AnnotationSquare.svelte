<script>
	import { createPopperActions } from 'svelte-popperjs';
	import { portal } from 'svelte-portal';

	/** @type{HTMLElement}*/
	export let el;

	// dependent on wrapper
	export let left;
</script>

<!-- track resizes etc -->

<button
	class="absolute top-0 hidden h-4 w-4 cursor-default rounded bg-amber-400/80 backdrop-blur-md sm:block"
	on:click><span class="sr-only">Open annotation</span></button
>
