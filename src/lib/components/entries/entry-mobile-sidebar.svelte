<script lang="ts">
	import { createDialog, melt } from '@melt-ui/svelte';
	import { XIcon } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { fade, fly } from 'svelte/transition';

	import { buttonVariants } from '$components/ui/button';
	import { cn } from '$lib/utils/tailwind';

	import EntrySidebarButton from './entry-sidebar-button.svelte';
	import mq from '$lib/stores/mq';

	export let open = writable(false);
	export let defaultOpen = false;
	const {
		elements: { overlay, content, close, portalled },
		options: { closeOnOutsideClick },
	} = createDialog({ open, defaultOpen });


    // on small sizes, the sidebar takes up the whole width, and popovers becomes dialogs - clicking those shouldn't trigger the close event
    $: if ($mq.max_sm) {
        closeOnOutsideClick.set(false)
    } else {
        closeOnOutsideClick.set(true)
    }
</script>

<EntrySidebarButton class="lg:hidden" {open} />

<div use:melt={$portalled} class="lg:hidden">
	{#if $open}
		<div
			class="fixed inset-0 z-[51] bg-background/80 backdrop-blur-sm"
			transition:fade={{ duration: 150 }}
			use:melt={$overlay}
		/>

		<div
			use:melt={$content}
			class="menu w-full sm:w-4/5 fixed bottom-0 right-0 z-[52] h-full bg-background px-2 pt-6 shadow-lg focus:outline-none"
			transition:fly={{ duration: 400, opacity: 1, x: 768 }}
		>
			<div
				class="absolute top-0 right-0 px-2 pt-6 h-[--nav-height] flex items-center"
			>
				<button
					class={cn(buttonVariants({ variant: 'ghost' }), 'p-0 w-10')}
					use:melt={$close}
				>
					<XIcon class="h-4 w-4" />
				</button>
			</div>
			<!--  -->
			<slot {open} openValue={$open} close={$close} />
		</div>
	{/if}
</div>
