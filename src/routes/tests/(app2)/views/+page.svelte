<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { H1, Lead } from '$lib/components/ui/typography';
	export let data;
</script>

<div class="flex items-center justify-between">
	<div>
		<H1>Views</H1>
		<Lead>Views allow you to see stuff you've saved in different ways.</Lead>
	</div>
	<Button href="/tests/views/explore/library">New view</Button>
</div>
{#each data.views as view}
	<div>
		<a href="/tests/views/{view.id}">{view.name}</a>
	</div>
{/each}
