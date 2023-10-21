<script lang="ts" context="module">
	import { createDialog } from '@melt-ui/svelte';
	import { VariantProps, cva } from 'class-variance-authority';
	import { XIcon } from 'lucide-svelte';
	import { fade, fly } from 'svelte/transition';

	export const sheetVariants = cva(
		'fixed z-[52] gap-4 bg-background p-6 shadow-lg transition ease-in-out',
		{
			variants: {
				side: {
					top: 'inset-x-0 top-0 border-b',
					bottom: 'inset-x-0 bottom-0 border-t',
					left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
					right: 'inset-y-0 right-0 h-full w-3/4  border-l sm:max-w-sm'
				}
			},
			defaultVariants: {
				side: 'right'
			}
		}
	);
</script>

<script lang="ts">
	export let side: VariantProps<typeof sheetVariants>['side'] = 'right';

	let xy =
		side === 'right'
			? { x: 350 }
			: side === 'left'
			? { x: -350 }
			: side === 'top'
			? { y: -350 }
			: { y: 350 };

	const { trigger, portal, overlay, content, title, description, close, open: open_store } = createDialog({
        closeOnOutsideClick: true
    });
    export let open = open_store;
</script>

<slot name="trigger" {trigger} />

<div use:portal>
	{#if $open}
		<div
			transition:fade={{ duration: 150 }}
			melt={$overlay}
			class="fixed inset-0 z-[52] bg-background/80 backdrop-blur-sm"
		/>
		<div
			transition:fly={{
				duration: 300,
				opacity: 1,
				...xy
			}}
			class={sheetVariants({ side })}
		>
			<button
				melt={$close}
                on:click={(e) => {
                    open.set(false);
                    console.log({e})
                }}
				class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
			>
				<XIcon class="h-4 w-4" />
				<span class="sr-only">Close</span>
			</button>
			<!-- TODO: header stuff -->
			<slot {close} {title} {description} />
		</div>
	{/if}
</div>
