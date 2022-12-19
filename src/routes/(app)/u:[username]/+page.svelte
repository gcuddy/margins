<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: console.log($page.data.user);

	$: self = data.username === $page.data.user?.username;

	// this needs to update after use enhance
	$: following = $page.data.user?.following.some((u) => u.username === data.username);
</script>

<!-- todo: hoist this header to layout -->
<Header>
	<DefaultHeader>
		<div slot="start">
			<div class="flex items-center gap-4">
				<SmallPlus>{$page.params.username}</SmallPlus>
				<!-- only render if we're logged in and we're not already looking at the logged-in user's profile (can't follow yourself!) -->
				{#if !self && $page.data.user}
					<!-- TODO: optimistic UI -->
					<form use:enhance action="?/{following ? 'un' : ''}follow" method="post">
						<Button type="submit" size="sm">Follow{following ? 'ing' : ''}</Button>
					</form>
				{/if}
			</div>
		</div>
	</DefaultHeader>
</Header>

<Saved annotations={data.articles} />
