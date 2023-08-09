<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	import { Writable, writable } from 'svelte/store';
	import Dialog from '$components/ui/dialog2/Dialog.svelte';
	import Cmd from './Cmd.svelte';
	import type { ComponentProps } from 'svelte';

	type $$Props = ComponentProps<Cmd> & {
		open?: Writable<boolean>;
        cmd?: Cmd;
        term?: string;
	};

	export let open = writable(false);
    export let term = '';

    // read-only
	export let cmd: Cmd | undefined = undefined;
	export const clear = () => cmd?.clear();

	const dialog = createDialog({
		open
	});

	const {
		elements: { portalled, overlay },
		options
	} = dialog;
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'j' && e.metaKey) {
			e.preventDefault();
			$open = !$open;
		}
		if (e.key === 'Escape') {
			if ($open) {
				e.preventDefault();
				open.set(false);
			}
		}
	}}
/>

<Dialog {dialog} class="overflow-hidden p-0 shadow-lg">
	<Cmd bind:term bind:this={cmd} on:back dialog {open} {...$$restProps} />
</Dialog>

<!-- <div use:portalled>
	{#if $open}
		<div use:melt={$overlay} />
	{/if}
</div> -->
