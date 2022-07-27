<script lang="ts">
	import { modals } from '$lib/stores/modals';

	import scrollingDown from '$lib/stores/scrolling-down';
	import type { ArticleWithTags } from '$lib/types';
	import Icon from './helpers/Icon.svelte';
	import Menu from './Menu/Menu.svelte';
	import TagInputCombobox from './TagInputCombobox.svelte';
	import { getTags } from '$lib/data/sync';

	export let back = '/';
	export let article: ArticleWithTags;
	// $: console.log({ $scrollingDown });
</script>

<div
	class="sticky top-0 flex w-full justify-between border-b pt-1 backdrop-blur-sm transition-opacity duration-300 {false
		? 'border-b-0 opacity-25 backdrop-blur-none'
		: 'opacity-100'} 
    hover:opacity-100    
    md:px-3"
>
	<a sveltekit:prefetch href={back}
		><Icon name="arrow" direction="w" />
		<span class="sr-only">Back to home</span></a
	>
	<Menu
		buttonAriaLabel="More option"
		menuItems={[
			[
				{ display: 'Archive', perform: () => archive(), icon: 'archive' },
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
		<div>
			<Icon name="options" />
			<span class="sr-only">Options</span>
		</div>
	</Menu>
</div>
