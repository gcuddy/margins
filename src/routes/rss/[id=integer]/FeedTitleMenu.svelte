<script lang="ts">
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import { Menu, MenuButton, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
	import type { RssFeed } from '@prisma/client';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { modals } from '$lib/stores/modals';
	import EditFeed from '../EditFeed.svelte';
	export let feed: RssFeed;
</script>

<ContextMenu
	placement="bottom-start"
	items={[
		[
			{
				label: 'Edit Feed',
				icon: 'rssSolid',
				perform: () => {
					modals.open(EditFeed, {
						feed
					});
				}
			}
		]
	]}
>
	<div class="flex items-center space-x-1">
		<SmallPlus>{feed.title}</SmallPlus>
		<Icon name="chevronDownSolid" className="h-4 w-4 fill-current" />
	</div>
</ContextMenu>
