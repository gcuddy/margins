<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import type { RssFeed } from '@prisma/client';
	export let feed: RssFeed;
</script>

<Form action="/rss" method="patch">
	<div class="flex flex-col">
		<GenericInput name="title" bind:value={feed.title} />
	</div>
	<Button type="submit">Submit</Button>
</Form>
