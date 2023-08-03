<script lang="ts">
	import { cn } from '$lib/utils/tailwind';
	import { createDialog, melt } from '@melt-ui/svelte';
	import { X } from 'lucide-svelte';
	import { fade, fly, scale } from 'svelte/transition';

    export let defaultOpen = false;
	export let dialog = createDialog();
    let { elements: {
        trigger, portalled, overlay, content, title, description, close
    }, states: {
        open,
    } } = dialog;
    if (defaultOpen) open.set(true);

	let internal_title = '';
	let internal_description = '';
	let className = '';
	export { internal_title as title, internal_description as description, className as class };
</script>

<!-- Should the createdialog be passed in, instead? -->

<!-- TODO: optionally replace slots with components (so you can set classes) -->

<slot name="trigger" trigger={$trigger} />

<div use:melt={$portalled}>
	{#if $open}
		<div in:fade={{duration: 150}} use:melt={$overlay} class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
		<div
			class={cn(
				// 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full',
                "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full sm:max-w-[425px]",
				className
			)}
			use:melt={$content}
		>
			{#if $$slots.header || internal_title || internal_description || $$slots.title || $$slots.description}
				<div class="flex flex-col space-y-1.5 text-center sm:text-left">
					<slot name="header" title={$title} description={$description}>
						{#if $$slots.title || internal_title}
							<h2 use:melt={$title} class="text-lg font-semibold leading-none tracking-tight">
								<slot name="title">
									{internal_title}
								</slot>
							</h2>
						{/if}
						{#if $$slots.description || internal_description}
							<div use:melt={$description} class="text-sm text-muted-foreground">
								<!--  -->
								<slot name="description">
									{internal_description}
								</slot>
							</div>
						{/if}
					</slot>
				</div>
			{/if}
			<slot {open} />

			{#if $$slots.footer}
				<div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
					<slot close={$close} name="footer" {open} />
				</div>
			{/if}


			<button
				use:melt={$close}
				aria-label="close"
				class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
			>
				<X class="h-4 w-4" />
				<span class="sr-only">Close</span>
			</button>
		</div>
	{/if}
</div>
