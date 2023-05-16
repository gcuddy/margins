<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import { X } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import type { HTMLBaseAttributes } from 'svelte/elements';
	import type { Readable } from 'svelte/store';
	import DialogOverlay from './DialogOverlay.svelte';
	const api: Readable<{
		close: () => void;
		dialogState: import('@rgossiaux/svelte-headlessui/components/dialog/Dialog.svelte').DialogStates;
	}> = getContext('headlessui-dialog-context');
	$: open = $api.dialogState === 0;
	let c = '';
	export { c as class };
	interface $$Props extends HTMLBaseAttributes {
		class?: string;
	}
</script>

<DialogOverlay />
<!-- Content -->
<div
	data-state={open ? 'open' : 'closed'}
	class={cn(
		'fixed z-50 grid w-full gap-4 rounded-b-lg border bg-background p-6 shadow-lg animate-in data-[state=open]:fade-in-90 data-[state=open]:slide-in-from-bottom-10 sm:max-w-lg sm:rounded-lg sm:zoom-in-90 data-[state=open]:sm:slide-in-from-bottom-0',
		c
	)}
	{...$$restProps}
>
	<slot close={$api?.close} />

	<!-- Dialog.Close -->
	<!-- data-state={open ? "open" : "closed"} -->
	<button
		on:click={() => $api.close()}
		class="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 hover:opacity-100 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900 dark:data-[state=open]:bg-gray-800"
	>
		<X class="h-4 w-4" />
		<span class="sr-only">Close</span>
	</button>
</div>
