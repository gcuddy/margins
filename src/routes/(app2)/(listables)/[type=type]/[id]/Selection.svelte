<script lang="ts">
	import { usePortal } from '@melt-ui/svelte/internal/actions';
	import { EditIcon, Highlighter } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import { scale } from 'svelte/transition';

	import * as Tooltip from '$components/ui/tooltip';

	import { Button } from '$components/ui/button';
	import { Muted } from '$components/ui/typography';

	import { setup } from './selection';
	import Kbd from '$components/ui/KBD.svelte';

	const mouseDown = writable(false);
	const { popperContent, show } = setup();

    const openDelay = 20;
    const closeDelay = 20;

	const dispatch = createEventDispatcher();

    function handleKeydown(event: KeyboardEvent) {
		if ($show) {
			// then listen for the "h" and "a" keys to highlight or annotate, respectively
			if (event.key === 'h') {
				// highlight
				const button = document.getElementById('highlight-button');
				if (button && button instanceof HTMLButtonElement) {
					button.click();
				}
			}
			if (event.key === 'a') {
				// annotate
				const button = document.getElementById('annotate-button');
				if (button && button instanceof HTMLButtonElement) {
					button.click();
				}
			}
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />


<svelte:document
	on:mousedown={(e) => {
		if (
			e.target instanceof HTMLElement &&
			e.target.closest('[data-annotation-popover]')
		) {
			return;
		}
		mouseDown.set(true);
	}}
	on:mouseup={() => {
		mouseDown.set(false);
	}}
/>

{#if $show}
	<div data-annotation-popover use:popperContent use:usePortal>
		<div
			class="z-50 w-auto select-none rounded-md border bg-popover p-1 shadow-md outline-none"
			in:scale={{
				delay: 50,
				start: 0.9,
			}}
		>
			<!-- TODO: replace buttons + text with icons + tooltips, and replace highlight button with a color (indicating current highlight color) -->
			<div class="flex justify-between space-x-2">
				<slot name="buttons">
					<Tooltip.Root {openDelay} {closeDelay}>
						<Tooltip.Trigger asChild let:builder>
							<Button
                                id="highlight-button"
								builders={[builder]}
								on:click={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
									dispatch('highlight');
								}}
								type="submit"
								class="flex h-auto flex-col space-y-1"
								variant="ghost"
							>
								<Highlighter class="h-5 w-5" />
								<Muted class="text-xs sr-only">Highlight</Muted>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content>
							<span>Highlight this passage</span>
							<Kbd>h</Kbd>
						</Tooltip.Content>
					</Tooltip.Root>
					<Tooltip.Root {openDelay} {closeDelay} >
						<Tooltip.Trigger asChild let:builder>
							<Button
                                id="annotate-button"
								builders={[builder]}
								on:click={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
									dispatch('annotate');
								}}
								variant="ghost"
								class="flex h-auto flex-col space-y-1"
							>
								<EditIcon class="h-5 w-5" />
								<Muted class="text-xs sr-only">Annotate</Muted>
							</Button></Tooltip.Trigger
						>
						<Tooltip.Content>
							<span>Annotate this passage</span>
							<Kbd>a</Kbd>
						</Tooltip.Content>
					</Tooltip.Root>
				</slot>
			</div>
		</div>
	</div>
{/if}
