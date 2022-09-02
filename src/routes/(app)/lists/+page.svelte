<script lang="ts">
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';

	import Button from '$lib/components/Button.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from '$lib/components/helpers/KeyboardNav/KeyboardNavItem.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import List from '$lib/components/layout/List.svelte';
	import type { PageData } from '../../../../.svelte-kit/types/src/routes/lists/$types';
	export let data: PageData;
	$: lists = data.lists;

	let active_item_id: number | undefined;
</script>

<!-- <Button>New list</Button> -->

<Header>
	<DefaultHeader>
		<div slot="start">
			<h1>Lists</h1>
		</div>
		<div slot="end">
			<Button variant="ghost">New list</Button>
		</div>
	</DefaultHeader>
</Header>

<KeyboardNav>
	<div class="flex flex-col">
		{#each lists as list, index}
			<!-- 			class="group block h-16 cursor-default group-focus:bg-gray-200 {active_item_id === list.id
					? 'bg-gray-100 dark:bg-gray-700'
					: ''} {active && 'bg-gray-200 dark:bg-gray-700/90'}" -->
			<KeyboardNavItem
				let:active
				let:followTabIndex
				{index}
				as="a"
				on:mouseover={() => (active_item_id = list.id)}
				on:focus={() => (active_item_id = list.id)}
				on:mouseleave={() => (active_item_id = undefined)}
				on:blur={() => (active_item_id = undefined)}
				href="/lists/{list.id}"
				class={({ active }) =>
					`block h-16 cursor-default group-focus:bg-gray-200 ${
						active_item_id === list.id ? 'bg-gray-100 dark:bg-gray-800' : ''
					} ${active && 'bg-gray-200 dark:bg-gray-800/90'}`}
			>
				<div
					class="flex h-full  items-center space-x-4 border-b py-3 px-6 dark:border-gray-700 lg:px-9"
				>
					<Icon name="viewGridSolid" className="h-4 w-4 fill-gray-600 dark:fill-gray-300" />
					<div class="flex grow items-center">
						<SmallPlus size="sm">{list.name}</SmallPlus>
					</div>
					<!-- items={[
						[
							{
								display: 'Edit View',
								id: 'edit',
								href: '/smart/{list.id}/edit',
								icon: 'collectionSolid'
							}
						],
						[
							{
								display: 'Favorite View',
								id: 'favorite',
								href: '/smart/{list.id}/edit',
								icon: 'starSolid'
							}
						]
					]} -->
					<ContextMenu
						buttonActions={[followTabIndex]}
						items={[
							[
								{
									label: 'Edit View',
									href: `/smart/${list.id}/edit`,
									icon: 'collectionSolid',
								},
							],
							[
								{
									label: `${list.favorite ? 'Unfavorite' : 'Favorite'} list`,
									href: '/smart/{list.id}/edit',
									icon: 'star',
									iconProps: {
										className: 'h-4 w-4 stroke-1 stroke-current',
									},
								},
							],
						]}
					>
						<Icon name="dotsHorizontalSolid" className="h-4 w-4 fill-gray-600 dark:fill-gray-300" />
						<!-- <svelte:fragment slot="items">
						<MenuItem>Edit</MenuItem>
						<MenuItem>Edit</MenuItem>
						<MenuItem>Favorite</MenuItem>
						<MenuItem>Trash</MenuItem>
					</svelte:fragment> -->
					</ContextMenu>
				</div>
			</KeyboardNavItem>
		{/each}
	</div>
</KeyboardNav>
