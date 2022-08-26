<script lang="ts">
	import type { RssItemWithFeed } from '$lib/types/rss';
	export let item: RssItemWithFeed;
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { notifications } from '$lib/stores/notifications';
	onMount(markRead);
	async function markRead() {
		if (item.is_read) return;
		// optimistic update
		item.is_read = true;
		const res = await fetch(`/api/mark_item_as_read`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: item.id
			})
		});
		if (!res.ok) {
			item.is_read = false;
			notifications.notify({
				type: 'error',
				message: 'Check your connection'
			});
		}
	}
	let og_id = item.id;
	$: if (item.id !== og_id) {
		item.id = og_id;
		item.is_read && markRead();
	}

	// when uuid changes, if item is not read, mark as read

	async function toggleRead() {
		item.is_read = !item.is_read;
		const res = await fetch(`/api/mark_item_as_read`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: item.id,
				unread: !item.is_read
			})
		});
		if (!res.ok) {
			item.is_read = !item.is_read;
			notifications.notify({
				type: 'error',
				message: 'Check your connection'
			});
		} else {
			notifications.notify({
				type: 'success',
				message: 'Item marked as read'
			});
		}
	}
</script>

<Button
	on:click={toggleRead}
	variant="ghost"
	className="flex items-center !px-1"
	tooltip={{ text: 'Mark as read' }}
>
	<div class="grid h-5 w-5 place-items-center">
		<Icon name="circle" className="h-4 w-4 {item.is_read ? '' : 'fill-gray-200'}" />
	</div>
	<!-- {item.is_read ? 'Read' : 'Unread'} -->
</Button>
