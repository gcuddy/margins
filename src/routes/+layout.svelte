<script lang="ts">
	import '../app.postcss';
	import '$lib/styles/font.css';

	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import { pwaInfo } from 'virtual:pwa-info';

	// fix bigint issue
	//  this is to fix an issue with BigInt and Kysely
	// prettier-ignore
	BigInt.prototype.toJSON = function() {
		return this.toString();
	};

	onMount(async () => {
		if (pwaInfo) {
			// @ts-expect-error - importing virtual pwa here, need to figure out how to fix types
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				// onRegisterError(error) {
				// 	console.log('SW registration error', error);
				// },
				onRegistered(r: { update: () => void }) {
					// eslint-disable-next-line no-unused-expressions
					r &&
						setInterval(() => {
							// console.log('Checking for sw update');
							r.update();
						}, 20_000);
					// eslint-disable-next-line no-console
					console.log(`SW Registered: ${r}`);
				},
			});
		}
	});

	// eslint-disable-next-line svelte/no-immutable-reactive-statements
	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html webManifest}
	<title>Margins</title>
</svelte:head>

<slot />

<Toaster
	richColors
	closeButton
	toastOptions={{
		class: 'toast',
	}}
/>
