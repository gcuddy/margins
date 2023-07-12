<!-- Transition.svelte -->
<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	export let key = ``;
</script>

{#key key}
	<!-- You can modify the in:fly|global and out:fly|global attributes to your liking! -->
	<div in:fly|global={{ delay: 100, duration: 200, y: -10 }} out:fly|global={{ duration: 100, y: 10 }}>
		<slot />
	</div>
{/key}
