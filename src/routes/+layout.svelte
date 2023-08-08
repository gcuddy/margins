<script lang="ts">
	import '../app.postcss';
	import '$lib/styles/font.css';

	import { page } from '$app/stores';
	import { handleSession } from '@lucia-auth/sveltekit/client';

	import { Toaster } from 'svelte-sonner';

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

<slot />
<!-- TODO: customize -->
<!-- position="bottom-center"
	toastOptions={{
		// style:
		// 	'border-width:1px; background-color: hsl(var(--background)); color: hsl(var(--foreground));',
		// className: '!shadow-lg !rounded-md !p-6 !pr-8 !text-sm',
		// iconTheme: {
		// 	primary: 'hsl(var(--primary))',
		// 	secondary: 'hsl(var(--secondary))'
		// }
	}} -->
<Toaster
    closeButton
    toastOptions={{
        class: 'toast'
    }}
/>
<!-- theme="system" -->

<style lang="postcss">
	/* :global(body > div) {
		height: 100%;
	} */
	/* nav {
		position: sticky;
		top: 0;
	} */
	:global(html) {
		@apply dark:bg-gray-800;
	}
</style>
