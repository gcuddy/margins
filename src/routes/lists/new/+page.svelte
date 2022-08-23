<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import KeyboardNav from '$lib/components/helpers/KeyboardNav/KeyboardNav.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: articles = data.articles;
</script>

<form class="space-y-4" action="/lists" method="POST">
	<label>
		Name
		<input type="text" name="name" /></label
	>
	<KeyboardNav>
		<div class="flex flex-col">
			<!-- copied from /smart - should make this into a component -->
			{#each articles as { title, id }}
				<label>
					<input type="checkbox" name="articles" value={id} />
					{title}
				</label>
			{/each}
		</div>
		<Button type="submit">Submit</Button>
	</KeyboardNav>
</form>
