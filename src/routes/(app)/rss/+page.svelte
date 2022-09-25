<script>
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import KeyboardNavItem from '$lib/components/helpers/KeyboardNav/KeyboardNavItem.svelte';
	import { user } from '$lib/stores/user';
</script>

<KeyboardNav startingIndex={3}>
	<ul>
		<li>
			<KeyboardNavItem as="a" href="/rss/entries" class="focus:bg-red-500" index={0}
				>All</KeyboardNavItem
			>
		</li>
		<li>
			<KeyboardNavItem as="a" href="/rss/unread" class="focus:bg-red-500" index={1}
				>Unread</KeyboardNavItem
			>
		</li>
		{#each $user?.feeds || [] as feed, index}
			<li>
				<KeyboardNavItem as="a" href="/rss/{feed.id}" class="focus:bg-red-500" index={index + 2}>
					{feed.title}</KeyboardNavItem
				>
			</li>
		{/each}
	</ul>
</KeyboardNav>
