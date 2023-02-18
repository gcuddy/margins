<script lang="ts">
	import "../app.css";
	import "$lib/styles/font.css";

	import { page } from "$app/stores";
	import { handleSession } from "@lucia-auth/sveltekit/client";

	handleSession(page);
	$: console.log({ $page });

	// fix bigint issue
	BigInt.prototype.toJSON = function () {
		return this.toString();
	};
</script>

<svelte:head>
	<title>Margins</title>
</svelte:head>

<div class="min-h-screen h-full ">
	<slot />
</div>

<style lang="postcss">
	/* :global(body > div) {
		height: 100%;
	} */
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

</style>
