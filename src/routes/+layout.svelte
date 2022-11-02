<script lang="ts">
	import '../app.css';
	import '$lib/styles/font.css';

	import { handleSession } from '@lucia-auth/sveltekit/client';
	import { page } from '$app/stores';

	handleSession(page, () => {
		console.log('session change');
	});
</script>

<svelte:head />

<div class="min-h-screen">
	<slot />
</div>

<style lang="postcss">
	:global(body > div) {
		height: 100%;
	}
	/* nav {
		position: sticky;
		top: 0;
	} */
	:global(::selection) {
		@apply bg-primary-300/75 dark:bg-primary-800;
	}
	:global(html) {
		@apply dark:bg-gray-800;
	}
	:global(:root) {
		color-scheme: light dark;
	}
</style>
