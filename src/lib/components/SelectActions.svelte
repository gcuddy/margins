<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { selectedArticleIds } from '$lib/components/Saved.svelte';
	import { disableGlobalKeyboardShortcuts } from '$lib/stores/keyboard';
	import { fadeScale, gentleFly } from '$lib/transitions';

	import { archive, bulkEditArticles } from '$lib/utils';
	import type { Article } from '@prisma/client';
	import { tick } from 'svelte';
	import { cubicOut, quintOut } from 'svelte/easing';
	import Button from './Button.svelte';
	import Form from './Form.svelte';
	import Icon from './helpers/Icon.svelte';
	export let articles: Article[] = [];
	// async function archive() {
	// 	articles = articles.map((article) => {
	// 		if ($selectedArticleIds.includes(article.id)) {
	// 			article.location = `ARCHIVE`;
	// 		}
	// 		return article;
	// 	});
	// 	const data = await bulkEditArticles($selectedArticleIds, {
	// 		location: 'ARCHIVE'
	// 	});
	// 	// TODO: possibly make into a form to avoid this invalidate / nonsense (using it causes a reload to update state)
	// 	invalidate('/');
	// 	console.log({ data });
	// 	$selectedArticleIds = [];
	// }
	const clear = () => ($selectedArticleIds = []);
	function handleKeydown(e: KeyboardEvent) {
		if ($disableGlobalKeyboardShortcuts) return;
		if (e.key === 'Escape') {
			clear();
		}
	}
	$: console.log($selectedArticleIds);

	let transitionDuration = 200;

	$: $page.url, ($selectedArticleIds = []);

	const _actions = {
		archive: true,
		tag: true,
		addToList: true
	};

	export let actions: Partial<typeof _actions> = _actions;
	console.log({ actions });
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- TODO: this transition is very janky, not sure why. maybe write my own? -->

{#if $selectedArticleIds.length}
	<div
		transition:gentleFly|local={{
			duration: 200,
			easing: cubicOut
		}}
		class="pointer-events-none fixed inset-x-0 bottom-9 z-10 flex justify-center"
	>
		<div
			class="pointer-events-auto flex h-11 flex-row items-center justify-center space-x-4 rounded-lg bg-gray-50 px-4 shadow-2xl ring ring-black/5 dark:bg-gray-700 dark:bg-gradient-to-b"
		>
			<span class="text-sm text-gray-400 dark:text-gray-300 lg:text-base"
				>{$selectedArticleIds.length} selected</span
			>
			<div class="flex space-x-4">
				<!-- <Button variant="ghost"> Move</Button> -->
				{#if actions.addToList}
					<Button
						variant="ghost"
						className="space-x-1 flex items-center lg:text-base"
						on:click={async () => {
							await archive($selectedArticleIds, null, '/', true);
						}}
						on:click={() => ($selectedArticleIds = [])}
						><Icon name="viewGridAdd" className="h-4 w-4 stroke-2 stroke-current" />
						<span>Add to List</span></Button
					>
				{/if}
				{#if actions.archive}
					<Button
						variant="ghost"
						className="space-x-2 flex items-center lg:text-base"
						on:click={async () => {
							await archive($selectedArticleIds, null, '/', true);
						}}
						on:click={() => ($selectedArticleIds = [])}
						><Icon name="archiveSolid" className="h-4 w-4 fill-current" />
						<span>Archive</span></Button
					>
				{/if}
				{#if actions.tag}
					<Button variant="ghost" className="lg:text-base">Tag</Button>
				{/if}
			</div>
		</div>
	</div>
{/if}
<!-- <MenuBar
	className="fixed rounded-lg shadow-2xl text-white bg-gray-800 left-0 right-0 top-4 m-auto max-w-sm md:max-w-md space-x-2 p-4 flex flex-col justify-between"
>
	<div class="mb-2 flex w-full justify-center"><span>{selected.length} selected</span></div>
	<div class="flex justify-center space-x-2">
		<MenuItem
			on:click={archive}
			className="hover:bg-purple-900/50 focus:bg-purple-900/50 p-2 flex justify-center w-full bg-purple-900/80 rounded-lg"
			>Archive</MenuItem
		>
		<MenuItem
			className="hover:bg-purple-900/50 focus:bg-purple-900/50 p-2 flex justify-center w-full bg-purple-900/80 rounded-lg"
			>Move</MenuItem
		>
		<MenuItem
			className="hover:bg-purple-900/50 focus:bg-purple-900/50 p-2 flex justify-center w-full bg-purple-900/80 rounded-lg"
			>Schedule</MenuItem
		>
		<MenuItem
			className="hover:bg-purple-900/50 focus:bg-purple-900/50 p-2 flex justify-center w-full bg-purple-900/80 rounded-lg"
			>Tag</MenuItem
		>
		<Form
			action="/"
			method="delete"
			pending={() => {
				// optimistic update
				articles = articles.filter((article) => !selected.includes(article.id));
				selected = [];
			}}
			done={({ form }) => {
				form.reset();
			}}
			on:submit={(e) => {
				const yes = confirm('Are you sure you want to delete these articles?');
				if (!yes) {
					console.log('preventing default');
					e.preventDefault();
				}
			}}
		>
			<input type="hidden" name="ids" value={selected.join(',')} />
			<MenuItem
				className="hover:bg-purple-900/50 focus:bg-purple-900/50 p-2 flex justify-center w-full bg-purple-900/80 rounded-lg"
				>Delete</MenuItem
			>
		</Form>
		<MenuItem on:click={clear} className="top-1 right-1 absolute "
			><Icon name="x" className="h-6 w-6" /><span class="sr-only">Cancel Selection</span></MenuItem
		>
	</div>
</MenuBar> -->
