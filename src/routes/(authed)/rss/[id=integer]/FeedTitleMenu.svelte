<script lang="ts">
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import { Menu, MenuButton, MenuItems, MenuItem } from '@rgossiaux/svelte-headlessui';
	import type { RssFeed } from '@prisma/client';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { modals } from '$lib/stores/modals';
	import EditFeed from '../EditFeed.svelte';
	import { notifications } from '$lib/stores/notifications';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import Button from '$lib/components/Button.svelte';
	import { goto } from '$app/navigation';
	export let feed: RssFeed;
	let confirm_modal = false;
	let delete_subscription_button: HTMLElement;
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
						feed,
					});
				},
			},
		],
		[
			{
				label: 'Copy Feed URL',
				icon: 'square2StackSolid',
				perform: () => {
					navigator.clipboard.writeText(feed.feedUrl);
					notifications.notify({
						message: 'Feed URL copied to clipboard',
						type: 'success',
					});
				},
			},
		],
		[
			{
				label: 'Delete Subscription',
				icon: 'trashSolid',
				perform: () => {
					confirm_modal = true;
				},
			},
		],
	]}
>
	<div class="flex items-center space-x-1">
		<SmallPlus>{feed.title}</SmallPlus>
		<Icon name="chevronDownSolid" className="h-4 w-4 fill-current" />
	</div>
</ContextMenu>

<ConfirmModal
	bind:isOpen={confirm_modal}
	confirmText="Delete"
	on:confirm={async () => {
		await fetch(`/rss/${feed.id}`, {
			method: 'DELETE',
		});
		goto('/rss');
		notifications.notify({
			message: 'Subscription deleted',
			type: 'success',
		});
	}}
>
	<span slot="title">Delete Subscription</span>
	<p>Are you sure you want to delete the "{feed.title}" subscription?</p>
</ConfirmModal>
