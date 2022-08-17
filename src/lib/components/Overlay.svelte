<script>
	import { createEventDispatcher, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();
	onDestroy(() => dispatch('destroy'));
</script>

<div class="fixed inset-0 z-10" />
