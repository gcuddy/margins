<script lang="ts">
	import { Dialog } from '@rgossiaux/svelte-headlessui';
	import DialogTrigger from './DialogTrigger.svelte';
	import type { ComponentProps } from 'svelte';

	export let isOpen = false;
	interface $$Props extends ComponentProps<Dialog<'div'>> {
		isOpen?: boolean;
	}
</script>

<div>
	{#if $$slots.trigger}
		<DialogTrigger bind:isOpen>
			<slot name="trigger" />
		</DialogTrigger>
	{/if}
	<Dialog
		class="fixed inset-0 z-50 flex items-start justify-center sm:items-center"
		open={isOpen}
		on:close={() => (isOpen = false)}
		on:close
	>
		<!-- TODO -->
		<slot />
	</Dialog>
</div>
