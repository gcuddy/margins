<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { writable } from 'svelte/store';

	import { Command } from '$components/ui/command2';
	import { cn } from '$lib/utils';

	import { Dialog, DialogContent } from '../dialog';
	import type { PageType, RootCommandProps } from './types';

	type T = $$Generic;
	type TPages = $$Generic<PageType>;
	type $$Props = Omit<RootCommandProps<T, TPages>, 'open'> & {
		open?: boolean;
        forceTop?: boolean;
        iniert? : boolean;
	};
	export let open: boolean = false;
	export let defaultShouldFilter = true;
	export let shouldFilter = writable(true);
	export let filterFunction: $$Props['filterFunction'] = undefined;
	export let comparisonFunction: $$Props['comparisonFunction'] = undefined;

	const scale = tweened(1, {
		duration: 100,
	});

	export function playBounce() {
		scale.set(0.98);
		setTimeout(() => {
			scale.set(1);
		}, 100);
	}

    export let fixedHeight = true;

    export let forceTop = false;

    export let inert = false;
</script>
<Dialog bind:open closeOnOutsideClick={!inert}>
	<DialogContent
        overlayClass={forceTop ? 'z-[52]' : undefined}
		style="--tw-scale-x: {$scale}; --tw-scale-y: {$scale};"
		class={cn(
			'overflow-hidden p-0 shadow-lg -translate-y-[33vh] will-change-transform origin-center ',
            forceTop && 'z-[9999]'
		)}
	>
    <div {inert} class={inert ? 'pointer-events-none' : ''}>
		<Command
            {defaultShouldFilter}
            {shouldFilter}
			{filterFunction}
			{comparisonFunction}
            {fixedHeight}
			{...$$restProps}
			class="[&_[data-command-group-heading]]:px-2 [&_[data-command-group-heading]]:font-medium [&_[data-command-group-heading]]:text-muted-foreground [&_[data-command-group]:not([hidden])_~[data-command-group]]:pt-0 [&_[data-command-group]]:px-2 [&_[data-command-input-wrapper]_svg]:h-5 [&_[data-command-input-wrapper]_svg]:w-5 [&_[data-command-input]]:h-12 [&_[data-command-item]:not([data-command-radio-item ])]:px-2 [&_[data-command-item]]:py-3 [&_[data-command-item]_svg]:h-5 [&_[data-command-item]_svg]:w-5"
            let:selectActiveItem
		>
			<slot {selectActiveItem} />
		</Command>
    </div>
	</DialogContent>
</Dialog>
