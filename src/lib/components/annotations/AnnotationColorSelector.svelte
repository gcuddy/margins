<script>
	import { fade } from "svelte/transition";
	import { reading_sidebar } from "$lib/features/entries/stores";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	transition:fade|global
	on:click={() => {}}
	class="fixed bottom-0 right-4 rounded-full bg-gray-800/80 p-2 {$reading_sidebar.active ? 'mr-[428px]' : ''}"
>
	<div class="rounded-full bg-yellow-400 p-4">sw</div>
</div>
