<script>
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
import Label from '$lib/components/ui/Label.svelte';
	import RadioGroupItem from '$lib/components/ui/radio-group/RadioGroupItem.svelte';

	export let data;
</script>

<form action="/tests?/setTheme&redirectTo={$page.url.pathname}" method="post">
<div class="flex flex-col space-y-4">
	{#each ['Light', 'Dark', 'System'] as Theme, i}
		{@const theme = Theme.toLowerCase()}
		<div class="flex items-center space-x-4">
		<input bind:group={data.theme} value={theme} type="radio" name="theme" id="theme-{theme}" />
		<Label for="theme-{theme}">
			{Theme}
		</Label>
	</div>
	{/each}
	<Button>Save</Button>
</div>
</form>