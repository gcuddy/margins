<script lang="ts">
	import {
		term,
		commandStore,
		filteredActions,
		selected,
		showCommandPalette,
		selectedCommand
	} from '$lib/stores/commands';
	import Dialog from '../helpers/dialog/Dialog.svelte';
	import DialogOverlay from '../helpers/dialog/DialogOverlay.svelte';
	import Combobox from '../helpers/Combobox.svelte';
	import Icon from '../helpers/Icon.svelte';
	import { fade } from 'svelte/transition';
	import { fadeScale } from '$lib/transitions';
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import KbdGroup from '../kbd/KbdGroup.svelte';
	import { animationHappening } from '$lib/stores/modals';
	function handleKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown': {
				selected.inc($filteredActions.length - 1);
				break;
			}
			case 'ArrowUp': {
				selected.dec();
				break;
			}
			case 'Enter': {
				e.preventDefault();
				$selectedCommand.perform();
				showCommandPalette.out();
			}
		}
	}

	function commandListener(e: KeyboardEvent) {
		if (e.metaKey && e.key === 'k') {
			e.preventDefault();
			showCommandPalette.toggle();
		}
		if (e.key === 'Escape') {
			showCommandPalette.out();
		}
	}
	// $: $term, selected.reset();
	let currentGroup: string;

	$: console.log({ $showCommandPalette });

	$: $showCommandPalette,
		$showCommandPalette
			? disableGlobalKeyboardShortcuts.on()
			: disableGlobalKeyboardShortcuts.off();

	let dialogRef: HTMLElement;
</script>

<svelte:window on:keydown={commandListener} />
<!-- todo: use virtual list -->

<Dialog bind:open={$showCommandPalette} class="fixed inset-0 z-50 overflow-y-auto p-4 pt-[15vh]">
	<DialogOverlay
		bind:el={dialogRef}
		class="fixed inset-0 bg-gray-500/5 dark:bg-black/10"
		transition={fade}
		transitionParams={{ duration: 150 }}
		on:outrostart={() => {
			$animationHappening = true;
		}}
		on:outroend={(e) => {
			console.log('outro done');
			$animationHappening = false;
			$term = '';
		}}
	/>
	<div transition:fadeScale={{ duration: 150, baseScale: 0.95 }}>
		<Combobox
			values={$filteredActions}
			bind:value={$term}
			fillValue={false}
			on:select={({ detail }) => {
				detail?.perform();
				$showCommandPalette = false;
			}}
			input={{
				class:
					'w-full bg-transparent text-lg border-0 focus:ring-0 text-gray-800 dark:text-gray-100 placeholder-gray-400  p-5',
				placeholder: 'Type a command…'
			}}
			options={{
				class: `max-h-96 text-sm overflow-y-auto ${!$filteredActions.length ? 'hidden' : ''}`
			}}
			static={true}
			class="relative mx-auto max-w-2xl divide-y divide-gray-100 overflow-hidden rounded-xl bg-gray-50 text-gray-900 shadow-2xl ring-1 ring-black/5 dark:divide-gray-600 dark:bg-gray-750 dark:text-gray-100"
		>
			<div slot="option" let:value let:active let:selected let:index>
				<!-- TODO: flesh out this separator -->
				{#if value.group && value.group !== $filteredActions[index - 1]?.group && index !== 0}
					<div class="h-4 w-full py-2">
						<div class="h-px bg-gray-100 dark:bg-gray-500/25" />
					</div>
				{/if}
				<div
					class="text-gray-600 dark:text-gray-300 {active
						? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:!text-white'
						: ''} flex h-12 w-full items-center justify-between gap-3.5 px-4 py-2"
				>
					<div class="flex gap-3.5">
						{#if value.icon}
							<Icon
								name={value.icon}
								className="{active
									? 'text-gray-600 dark:text-gray-300'
									: 'text-gray-500 dark:text-gray-400'} h-5 w-5 stroke-current stroke-2"
							/>
						{/if}
						<span>{value.name}</span>
					</div>
					{#if value.kbd}
						<KbdGroup kbd={value.kbd} />
					{/if}
				</div>
			</div>
		</Combobox>
	</div>
</Dialog>
