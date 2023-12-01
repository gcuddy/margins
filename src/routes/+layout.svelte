<script lang="ts">
	import '../app.postcss';
	import '$lib/styles/font.css';

	import { Toaster, toast } from 'svelte-sonner';
	import { page } from '$app/stores';
	import { getFlash } from 'sveltekit-flash-message/client';
	import { onDestroy } from 'svelte';
	import { styleToString } from '$lib/helpers';
	import { pageTitle } from '$lib/stores/page-title';
	import type { Message } from '$lib/types';
	// import { pwaInfo } from 'virtual:pwa-info';

	// fix bigint issue
	//  this is to fix an issue with BigInt and Kysely
	// prettier-ignore'
	// @ts-expect-error
	BigInt.prototype.toJSON = function () {
		return this.toString();
	};

	const flash = getFlash(page);

	const unsubscribeFlash = flash.subscribe(($flash) => {
		console.log({ $flash });
		if (!$flash) return;

		toast[$flash.status]($flash.text);
		// fancy way of doing:
		// if ($flash.status === "success") {
		//     toast.success($flash.text)
		// } else if ($flash.status === "error") {
		//     toast.error($flash.text)
		// } else if ($flash.status === "warning") {
		//     toast.warning($flash.text)
		// } else {
		//     toast.info($flash.text)
		// }

		flash.set(undefined);
	});
	const unsusbcribePageForm = page.subscribe((page) => {
		if (page.form && 'form' in page.form) {
			if (
				'message' in page.form.form &&
				page.form.form.message &&
				'status' in page.form.form.message &&
				'text' in page.form.form.message
			) {
				const message = page.form.form.message as Message;
				toast[message.status](message.text);
			}
		}
		// pageTitle.set(page.title);
	});

	onDestroy(() => {
		unsubscribeFlash();
		unsusbcribePageForm();
	});

	// onMount(async () => {
	// 	if (pwaInfo) {
	// 		// @ts-expect-error - importing virtual pwa here, need to figure out how to fix types
	// 		const { registerSW } = await import('virtual:pwa-register');
	// 		registerSW({
	// 			immediate: true,
	// 			// onRegisterError(error) {
	// 			// 	console.log('SW registration error', error);
	// 			// },
	// 			onRegistered(r: { update: () => void }) {
	// 				// eslint-disable-next-line no-unused-expressions
	// 				r &&
	// 					setInterval(() => {
	// 						// console.log('Checking for sw update');
	// 						r.update();
	// 					}, 20_000);
	// 				// eslint-disable-next-line no-console
	// 				console.log(`SW Registered: ${r}`);
	// 			},
	// 		});
	// 	}
	// });

	// // eslint-disable-next-line svelte/no-immutable-reactive-statements
	// $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
	<title>{$pageTitle}</title>
</svelte:head>

<slot />

<div class="rounded-md border shadow-lg"></div>
<Toaster
	closeButton
	toastOptions={{
		class: 'toast group shadow-lg transition-all ',
		style: styleToString({
			// position: 'relative',
			// 'pointer-events': 'auto',
			// display: 'flex',
			// width: '100%',
			// 'align-items': 'center',
			// 'justify-content': 'space-between',
			// gap: '1rem',
			// overflow: 'hidden',
			// 'border-radius': `calc(var(--radius) - 2px)`,
			// 'border-width': '1px',
			// padding: '1.5rem 2rem 1.5rem 1.5rem',
		}),
	}}
/>
