<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: lists = data.lists;
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

<ul>
	{#each lists as list}
		<li><a href="/lists/{list.id}">{list.name}</a></li>
	{/each}
</ul>
