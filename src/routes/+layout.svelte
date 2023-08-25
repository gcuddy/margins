<script lang="ts">
	import '../app.postcss';
	import '$lib/styles/font.css';
	import { pwaInfo } from 'virtual:pwa-info';

	import { page } from '$app/stores';

	import { Toaster } from 'svelte-sonner';
	import { onMount } from 'svelte';

	$: console.log({ $page });

	// fix bigint issue
	BigInt.prototype.toJSON = function () {
		return this.toString();
	};

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r) {
					r &&
						setInterval(() => {
							console.log('Checking for sw update');
							r.update();
						}, 20000);
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error) {
					console.log('SW registration error', error);
				}
			});
		}
	});

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	{@html webManifest}
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
