<script lang="ts">
	import { enhance } from '$app/forms';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import Saved from '$lib/components/Saved.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: bookmarks = data.bookmarks || [];
</script>

<form method="post" use:enhance action="?/new">
	<!-- <input type="text" name="url" /> -->
	<GenericInput name="url" />
	<button>Submit</button>
</form>
<!--
{#each bookmarks as bookmark (bookmark.id)}
	<div>
		<h2>{bookmark.title || bookmark.url}</h2>
		<a href="/cached/{bookmark.id}">Cached</a>
		<div>{bookmark.url}</div>
		<p>{bookmark.description}</p>
		<span>{bookmark.createdAt}</span>
	</div>
{/each} -->

<Saved
	annotations={bookmarks}
	font="sans"
	alwaysShowDescription={true}
	externalLink={true}
	viewOptions={{
		properties: {
			image: true,
			description: true,
			url: true,
		},
	}}
/>
