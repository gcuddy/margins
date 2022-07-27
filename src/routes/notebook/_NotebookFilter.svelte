<script lang="ts">
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Menu from '$lib/components/Menu/Menu.svelte';
	import MenuItem from '$lib/components/Menu/MenuItem.svelte';
	import MenuItems from '$lib/components/Menu/MenuItems.svelte';
	import { NotebookFilter, notebookFilter } from '$lib/stores/notebook';

	let currentFilter = NotebookFilter.All;
	$: console.log(Object.values(NotebookFilter));
	const set = (type: NotebookFilter) => {
		notebookFilter.set(type);
		currentFilter = type;
	};
</script>

<Menu>
	<div slot="button" class="flex items-center">
		{currentFilter}
		<span aria-hidden="true"><Icon name="chevron" direction="s" className="stroke-2" /></span>
	</div>
	<MenuItems>
		{#each Object.values(NotebookFilter) as filter}
			<MenuItem on:click={() => set(filter)} role="menuitemradio">{filter}</MenuItem>
		{/each}
	</MenuItems>
</Menu>
