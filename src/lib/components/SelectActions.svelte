<script lang="ts">
	import { invalidate } from '$app/navigation';

	import { cachedArticlesArray } from '$lib/stores/cache';
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { notifications } from '$lib/stores/notifications';
	import { syncStore } from '$lib/stores/sync';
	import { gentleFly } from '$lib/transitions';
	import type { ArticleInList } from '$lib/types';
	import { LOCATIONS, LOCATION_LIST, LOCATION_TO_ICON_OUTLINE } from '$lib/types/schemas/Locations';

	import { archive, bulkEditArticles } from '$lib/utils';
	import { backIn, backOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { map } from 'zod';
	import Button from './Button.svelte';
	import { commandPaletteStore } from './CommandPalette/store';
	import Icon from './helpers/Icon.svelte';

	import { createEventDispatcher } from 'svelte';

	const dispatch$1 = createEventDispatcher<{
		update: {
			articles: ArticleInList[];
		};
	}>();
	const dispatch = () => dispatch$1('update', { articles: selected_articles });

	const clear = () => (selected_articles = []);

	const move = () => {
		commandPaletteStore.open({
			values: LOCATION_LIST,
			placeholder: 'Move to…',
			itemIcon: (val, active) => {
				console.log({ val });
				return {
					component: Icon,
					props: {
						name: LOCATION_TO_ICON_OUTLINE[val.id],
						className: `h-5 w-5 stroke-2 stroke-current ${
							active && 'dark:stroke-primary-100 stroke-primary-900'
						}`
					}
				};
			},
			onSelect: async ({ detail }) => {
				const id = syncStore.add();
				// optimistic update
				selected_articles = selected_articles.map((article) => ({
					...article,
					location: detail.id
				}));
				console.log({ selected_articles });
				dispatch();
				await bulkEditArticles(article_ids, {
					location: detail.id
				});
				notifications.notify({
					message: `Moved ${selected_articles.length} articles to ${detail.name}`,
					title: `Moved to ${detail.name}`,
					type: 'success'
				});
				clear();
				syncStore.remove(id);
			}
		});
	};

	function handleKeydown(e: KeyboardEvent) {
		if ($disableGlobalKeyboardShortcuts) return;
		if (!selected_articles?.length) return;
		if (e.key === 'Escape') {
			clear();
		}
		if (e.key === 'm') {
			e.preventDefault();
			e.stopPropagation();
			move();
		}
	}
	const _actions = {
		archive: true,
		tag: true,
		addToList: true,
		moveTo: true
	};
	export let actions: Partial<typeof _actions> = _actions;

	// todo: expand this so it can take other things besides articles?
	export let selected_articles: ArticleInList[];
	$: article_ids = selected_articles.map(({ id }) => id);
</script>

<svelte:window on:keydown={handleKeydown} />

{#if selected_articles.length}
	<div
		in:gentleFly|local={{
			duration: 400,
			easing: backOut
		}}
		out:gentleFly|local={{
			duration: 400,
			easing: backIn
		}}
		class="pointer-events-none fixed inset-x-0 bottom-9 z-30 flex justify-center"
	>
		<div
			class="dark:ring-black/15 pointer-events-auto flex h-11 flex-row items-center justify-center space-x-4 rounded-lg bg-gray-50 px-4 shadow-2xl ring ring-black/5 dark:bg-gray-800 dark:bg-gradient-to-br"
		>
			<span class="text-sm text-gray-500 dark:text-gray-300 lg:text-base">
				<span>{selected_articles.length}</span> selected</span
			>
			<div class="flex space-x-4">
				<!-- <Button variant="ghost"> Move</Button> -->
				{#if actions.addToList}
					<Button
						variant="ghost"
						className="space-x-1 flex items-center lg:text-base"
						on:click={async () => {
							await archive(article_ids, null, '/', true);
							clear();
						}}
						><Icon name="viewGridAdd" className="h-4 w-4 stroke-2 stroke-current" />
						<span>Add to List</span></Button
					>
				{/if}
				{#if actions.archive}
					<Button
						variant="ghost"
						className="space-x-2 flex items-center lg:text-base"
						on:click={async () => {
							await archive(article_ids, null, '/', true);
						}}
						><Icon name="archiveSolid" className="h-4 w-4 fill-current" />
						<span>Archive</span></Button
					>
				{/if}
				{#if actions.moveTo}
					<Button
						variant="transparent"
						className="space-x-1 flex items-center lg:text-base"
						on:click={move}
						tooltip={{
							text: 'Move to location',
							kbd: 'm'
						}}
						><Icon name="arrowSmRight" className="h-4 w-4 stroke-2 stroke-current" />
						<span>Move to…</span></Button
					>{/if}
				{#if actions.tag}
					<Button variant="ghost" className="lg:text-base">Tag</Button>
				{/if}
			</div>
		</div>
	</div>
{/if}
