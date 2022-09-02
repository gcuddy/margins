<script lang="ts">
	import '../app.css';
	import { Lucia } from 'lucia-sveltekit/client';
</script>

<svelte:head />

<Lucia on:error={(e) => console.log({ e })}>
	<div class="min-h-screen">
		<slot />
	</div>
</Lucia>

<style lang="postcss">
	:global(body > div) {
		height: 100%;
	}
	/* nav {
		position: sticky;
		top: 0;
	} */
	:global(::selection) {
		@apply bg-primary-600/50 dark:bg-primary-800;
	}
	:global(html) {
		@apply dark:bg-gray-800;
	}
	:global(:root) {
		color-scheme: light dark;
	}
</style>
