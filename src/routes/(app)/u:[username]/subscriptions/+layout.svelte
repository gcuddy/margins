<script>
	import { page } from '$app/stores';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import FeedModal from '$lib/components/FeedModal.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import ModalContainer from '$lib/components/modals/ModalContainer.svelte';
	import { modals } from '$lib/stores/modals';
	import FeedTitleMenu from './FeedTitleMenu.svelte';

	let modal = false;
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			{#if $page.data.subscription}
				<FeedTitleMenu subscription={$page.data.subscription} />
			{:else}
				<SmallPlus>{$page.data.title || 'Subscriptions'}</SmallPlus>
			{/if}
		</div>
		<div class="flex gap-2" slot="end">
			<Button
				variant="ghost"
				as="a"
				href="/u:{$page.params.username}/subscriptions/new"
				on:click={(e) => {
					e.preventDefault();
					modals.open(FeedModal, {}, 'feed-entry');
					modal = true;
				}}
			>
				<Icon name="plusSmall" className="h-5 w-5 fill-current" />
				<span>Add Subscription</span></Button
			>
			<button
				on:click={async () => {
					const res = await fetch('/api/refresh', {
						method: 'POST',
					});
					const json = await res.json();
					console.log({ json });
				}}>refresh</button
			>
		</div>
	</DefaultHeader>
</Header>
<slot />

<!-- <Dialog open={modal}>
	<FeedModal />
</Dialog> -->
