<script lang="ts">
	import { enhance } from '$app/forms';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Button from '$lib/components/Button.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ url, title, description, html } = data);
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			<SmallPlus>Add Article</SmallPlus>
		</div>
	</DefaultHeader>
</Header>
<div class="grid">
	<form class="space-y-2 px-10 pt-[10vh] text-lg" action="/add" method="post">
		<div class="container mx-auto flex flex-col gap-4">
			<label for="url">Enter a URL to save:</label>
			<GenericInput
				type="text"
				variant="underline"
				name="url"
				value={url}
				placeholder="https://example.com"
				class="text-xl text-amber-900 dark:text-amber-50"
			/>
			<input type="hidden" name="html" value={html} />
			<Button type="submit" size="lg" className="place-self-end space-x-2" scaleOnHover={true}
				><span>Submit</span> <Icon name="arrowSmRightSolid" /></Button
			>
		</div>
		<!-- <div class="flex gap-3">
			<label for="title">Title</label><input name="title" type="text" value={title} />
		</div> -->
		<!-- <div class="flex gap-3">
			<label for="description">Description</label><textarea
				name="description"
				id="description"
				cols="30"
				rows="10"
				value={description}
			/>
		</div>
		<div class="flex gap-3"><label for="Tags">Tags</label><input type="text" name="tags" /></div> -->
		<!-- if we're submitting a bookmark, this matters below — not sure if this should be for both read-later and bookmarks, tho -->
	</form>
</div>
