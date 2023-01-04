<script lang="ts">
	import { page } from '$app/stores';
	import {
		commandStore,
		filteredActions,
		selected,
		selectedCommand,
		showCommandPalette,
		term,
	} from '$lib/stores/commands';
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { animationHappening, modals } from '$lib/stores/modals';
	import { selectedItems } from '$lib/stores/selectedItems';
	import { fadeScale } from '$lib/transitions';
	import { getUser } from '@lucia-auth/sveltekit/client';
	import { get } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import Combobox from '../helpers/Combobox.svelte';
	import Dialog from '../helpers/dialog/Dialog.svelte';
	import DialogOverlay from '../helpers/dialog/DialogOverlay.svelte';
	import Icon from '../helpers/Icon.svelte';
	import KbdGroup from '../kbd/KbdGroup.svelte';
	import TagModal from '../TagModal.svelte';
	import Selection from './Selection.svelte';
	import type { Command } from './types';

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
				$selectedCommand.perform({ page: $page });
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
	function handleTouch(e: TouchEvent) {
		if (e.touches.length === 2) {
			e.preventDefault();
			setTimeout(() => {
				showCommandPalette.toggle();
			}, 100);
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

	const selected_article_commands: Command[] = [
		// TODO
		{
			id: 'article-tag',
			name: `Tag article${$selectedItems.length > 1 ? 's' : ''}`,
			group: 'adhoc-article-commands',
			icon: 'tag',
			perform: async () => {
				modals.open(
					TagModal,
					{
						allTags: $page.data.allTags,
						articles: $selectedItems,
					},
					'tag-modal'
				);
				// const res = await updateTagsOnArticles(
				// 	$selectedItems.map((i) => i.id),
				// 	['test']
				// );
			},
		},
		{
			id: 'article-delete',
			name: `Delete article${$selectedItems.length > 1 ? 's' : ''}`,
			group: 'adhoc-article-commands',
			icon: 'trash',
			perform: () => {
				$selectedItems.forEach((item) => {
					//    TODO: delete
				});
			},
		},
	];
	$: $selectedItems.length
		? selected_article_commands.forEach((command) => commandStore.add(command, true))
		: ($commandStore = $commandStore.filter((c) => c.group !== 'adhoc-article-commands'));
</script>

<svelte:window on:keydown={commandListener} on:touchstart={handleTouch} />
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
				let user = getUser();
				detail?.perform({ page: $page, user: get(user) });
				$showCommandPalette = false;
			}}
			input={{
				class:
					'w-full bg-transparent text-lg border-0 focus:ring-0 text-gray-800 dark:text-gray-100 placeholder-gray-400 p-4',
				placeholder: 'Type a command…',
			}}
			options={{
				class: `max-h-96 pt-4 text-sm overflow-y-auto scrollbar-hide ${
					!$filteredActions.length ? 'hidden' : ''
				}`,
			}}
			static={true}
			class="relative mx-auto max-w-2xl divide-y divide-gray-100 overflow-hidden rounded-xl bg-gray-50 p-2 text-gray-900 shadow-2xl ring-1 ring-black/5 dark:divide-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:transparency:bg-gray-800/50 dark:transparency:backdrop-blur-xl dark:transparency:backdrop-brightness-75 dark:transparency:backdrop-contrast-75 dark:transparency:backdrop-saturate-200"
		>
			<div slot="inputPeer" class="flex px-4 text-sm">
				{#if $selectedItems.length}
					<Selection>
						{$selectedItems.length > 1
							? $selectedItems.length + ' articles'
							: $selectedItems[0].title}
					</Selection>
				{:else if $page.data.entry || $page.data.article}
					{@const entry = $page.data.entry || $page.data.article}
					<Selection>
						{entry.title}
					</Selection>
				{/if}
			</div>
			<div slot="option" let:value let:active let:selected let:index>
				<!-- TODO: flesh out this separator -->
				{#if value.group && value.group !== $filteredActions[index - 1]?.group && index !== 0}
					<div class="h-4 w-full py-2">
						<div class="h-px bg-gray-100 dark:bg-gray-500/25" />
					</div>
				{/if}
				<div
					class="rounded-lg p-1 font-medium text-gray-600 dark:text-gray-300  {active
						? 'bg-amber-400/50 font-bold text-gray-800 dark:bg-gray-700 dark:!text-white'
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
