<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import ConfirmModal from '$lib/components/ConfirmModal.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { modals } from '$lib/stores/modals';
	import { notifications } from '$lib/stores/notifications';
	// import EditFeed from '../rss/EditFeed.svelte';
	import type { SubscriptionWithFeed } from './[id=integer]/types';

	export let subscription: SubscriptionWithFeed;
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
						feed: subscription.feed,
					});
				},
			},
		],
		[
			{
				label: 'Copy Feed URL',
				icon: 'square2StackSolid',
				perform: () => {
					navigator.clipboard.writeText(subscription.feed.feedUrl);
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
		<SmallPlus>{subscription.title}</SmallPlus>
		<Icon name="chevronDownSolid" className="h-4 w-4 fill-current" />
	</div>
</ContextMenu>

<ConfirmModal
	bind:isOpen={confirm_modal}
	confirmText="Delete"
	on:confirm={async () => {
		console.log({ subscription });
		await fetch(`/api/subscriptions/${subscription.id}`, {
			method: 'DELETE',
		});
		goto(`/u:${$page.data.user?.username}/subscriptions`);
		notifications.notify({
			message: 'Subscription deleted',
			type: 'success',
		});
	}}
>
	<span slot="title">Delete Subscription</span>
	<p>Are you sure you want to delete the "{subscription.title}" subscription?</p>
</ConfirmModal>
