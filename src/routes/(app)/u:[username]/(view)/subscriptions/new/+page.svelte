<script lang="ts">
	import { enhance } from '$app/forms';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import type { ActionData } from './$types';
	export let form: ActionData;
	$: console.log({ form });
</script>

<!-- eventually abstract this to component -->
<form action="?/search" method="post" use:enhance>
	<GenericInput name="url" />
	<button>submit</button>
	{#if form && 'message' in form}
		<span class="text-red-500">{form.message}</span>
	{/if}
</form>

{#if form && 'feeds' in form && form?.feeds && form.feeds.length}
	<form action="?/add" method="post" use:enhance>
		{#each form.feeds as feed, index}
			<label>
				{feed.url}
				<input type="checkbox" name="feeds[{index}][url]" value={feed.url} checked={index === 0} />
				<GenericInput value={feed.title} name="feeds[{index}][title]" />
			</label>
		{/each}
		<button>submit</button>
	</form>
{/if}
{#if form && 'success' in form}
	<span class="text-lime-500">Successfully added</span>
{/if}
