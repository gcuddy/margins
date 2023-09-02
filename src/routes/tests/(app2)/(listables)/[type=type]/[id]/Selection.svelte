<script lang="ts">
	import { usePortal } from '@melt-ui/svelte/internal/actions';
	import { EditIcon, Highlighter } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import { scale } from 'svelte/transition';

	import { Button } from '$components/ui/button';
	import { Muted } from '$components/ui/typography';

	import { setup } from './selection';

	const mouseDown = writable(false);
	const { popperContent, show } = setup();

	const dispatch = createEventDispatcher();
</script>

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
					<Button
						on:click={() => {
							dispatch('highlight');
						}}
						type="submit"
						class="flex h-auto flex-col space-y-1"
						variant="ghost"
					>
						<Highlighter class="h-5 w-5" />
						<Muted class="text-xs">Highlight</Muted>
					</Button>
					<Button
						on:click={() => {
							dispatch('annotate');
						}}
						variant="ghost"
						class="flex h-auto flex-col space-y-1"
					>
						<EditIcon class="h-5 w-5" />
						<Muted class="text-xs">Annotate</Muted>
					</Button>
				</slot>
			</div>
		</div>
	</div>
{/if}
