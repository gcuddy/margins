<script lang="ts">
	import type { RssItemWithFeed } from '$lib/types/rss';
	export let item: RssItemWithFeed;
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import { notifications } from '$lib/stores/notifications';
	async function toggleRead() {
		item.is_read = !item.is_read;
		const res = await fetch(`/rss/${item.rssFeedId}/${item.uuid}/mark_as_read`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				unread: !item.is_read,
			}),
		});
		if (!res.ok) {
			item.is_read = !item.is_read;
			notifications.notify({
				type: 'error',
				message: 'Check your connection',
			});
		} else {
			notifications.notify({
				type: 'success',
				message: 'Item marked as read',
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
