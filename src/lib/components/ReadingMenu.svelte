<script lang="ts">
	import { modals } from '$lib/stores/modals';

	import scrollingDown from '$lib/stores/scrolling-down';
	import type { ArticleWithNotesAndTagsAndContext, ArticleWithTags } from '$lib/types';
	import Icon from './helpers/Icon.svelte';
	import Menu from './Menu/Menu.svelte';
	import TagInputCombobox from './TagInputCombobox.svelte';
	import { getTags } from '$lib/data/sync';
	import { mainEl, mainElScroll } from '$lib/stores/main';
	import scrollDirection from '$lib/stores/scrollDirection';
	import Muted from './atoms/Muted.svelte';
	import CircularProgressBar from './CircularProgressBar/CircularProgressBar.svelte';
	import Button from './Button.svelte';
	import { fly } from 'svelte/transition';
	import ReadingSidebar from './ReadingSidebar.svelte';

	export let back = '/';
	export let article: ArticleWithNotesAndTagsAndContext;

	export let reading_sidebar_active = false;

	const scrollDown = scrollDirection($mainEl);
	$: console.log({ $scrollDown });
	// $: console.log({ $scrollingDown });

	let lastScroll = 0;
	let down = false;
	function checkDown() {
		console.log({
			lastScroll,
			$mainElScroll
		});
		if ($mainElScroll.y > lastScroll) {
			return true;
		} else {
			return false;
		}
		lastScroll = $mainElScroll.y;
	}
	$: down = checkDown();
	$: console.log({ down });
	$: console.log($mainElScroll.down);

	let saved_position: number | null;
	let ticking = true;
	function handleScrollToTop() {
		saved_position = $mainElScroll.y;
		console.log({ saved_position });
		$mainEl.scrollTo({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
		const checkIfScrollIsStatic = setInterval(() => {
			if ($mainEl.scrollTop === 0) {
				clearInterval(checkIfScrollIsStatic);
				ticking = false;
			}
		}, 50);
	}
	function returnToPosition() {
		console.log({ saved_position });
		$mainEl.scrollTo({
			top: saved_position as number,
			left: 0,
			behavior: 'smooth'
		});
		saved_position = null;
	}
	// $: if (saved_position)
	$: if (!ticking && $mainElScroll.offset > 0.05) {
		// saved_position = null;
	}

	$: hide =
		$mainElScroll.down &&
		$mainElScroll.y > 500 &&
		$mainElScroll.offset < 0.99 &&
		!reading_sidebar_active;
</script>

<!-- -translate-y-12 -->
<div
	class="sticky top-0 z-20 flex w-full  transform-gpu justify-between border-b bg-stone-50/90 py-0.5 px-2 backdrop-blur-lg transition duration-500 hover:opacity-100 dark:bg-stone-800/90
  {hide ? ' opacity-0' : 'translate-y-0 opacity-100'}
    md:px-3"
>
	<a class="flex items-center md:pl-0" sveltekit:prefetch href={back}
		><Icon name="arrow" direction="w" />
		<span class="sr-only">Back to home</span></a
	>
	<div
		class=" flex -translate-y-24 transform-gpu items-center opacity-0 transition-all {$mainElScroll.y >
			135 && '!translate-y-0 !opacity-100'}"
	>
		<!-- This should check when the header is off screen. When it is, it should receive the Title and gently transition it in. -->

		<div
			class="flex grid-cols-4 items-center gap-2"
			on:click={handleScrollToTop}
			aria-label="Click to scroll to top"
			title="Click to scroll to top"
		>
			<div class="col-span-1 ml-auto hidden items-center sm:flex">
				<CircularProgressBar
					minValue={0}
					maxValue={1}
					value={$mainElScroll.offset}
					className="h-4 w-4 stroke-2 transition-all"
					trailClass="stroke-gray-400"
					pathClass={$mainElScroll.offset < 0.99 ? 'stroke-primary-600' : 'stroke-lime-600'}
				/>
			</div>
			<!-- TODO: clicking this will send you back to top, but save current scroll -->
			<span class="col-span-2 w-28 max-w-xs shrink truncate sm:w-auto md:max-w-md lg:max-w-lg"
				>{article.title}</span
			>
			{#if article.author}
				<div class="col-span-1 hidden sm:block">
					<Muted>{article.author}</Muted>
				</div>
			{/if}
		</div>
	</div>
	<div class="flex items-end space-x-2">
		<Menu
			buttonAriaLabel="More option"
			menuItems={[
				[
					{ display: 'Trash', perform: () => console.log('trash'), icon: 'trash' },
					{
						display: 'Tag',
						perform: async () => {
							modals.open(
								TagInputCombobox,
								{
									articles: [article],
									allTags: await getTags()
								},
								{
									bgClassname: ''
								}
							);
						},
						icon: 'tag'
					}
				],
				[{ display: 'Edit Metadata', perform: () => console.log('edit'), icon: 'pencil' }]
			]}
		>
			<div class="flex items-center">
				<Icon name="options" />
				<span class="sr-only">Options</span>
			</div>
		</Menu>
		<button on:click={() => (reading_sidebar_active = !reading_sidebar_active)} class="z-40">
			<Icon name="sidebar" className="h-4 w-4 stroke-2 stroke-current" />
		</button>
	</div>
</div>

<!-- Return to position -->

{#if saved_position && $mainElScroll.offset < 0.02}
	<div
		transition:fly={{
			y: 10
		}}
		class="fixed bottom-4 right-4 text-2xl sm:right-8"
	>
		<Button on:click={returnToPosition} variant="ghost">Return to position</Button>
	</div>
{/if}

<!-- Reading Sidebar -->
<ReadingSidebar bind:article bind:active={reading_sidebar_active} />
