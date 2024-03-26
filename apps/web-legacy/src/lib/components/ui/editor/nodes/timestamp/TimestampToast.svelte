<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Use this component in your app:
	// toast(RichContent)
</script>

<span>
	Custom and <b>bold</b>
	<button
		on:click={() => {
			dispatch('removeToast');
		}}>Dismiss</button
	>
</span>
