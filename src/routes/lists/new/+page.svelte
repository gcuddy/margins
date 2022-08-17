<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ fetch }) => {
		const res = await fetch('/api/articles?fields=id,title', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		if (!res.ok) {
			return {
				status: res.status
			};
		}
		const { articles } = await res.json();
		return {
			status: 200,
			props: {
				articles
			}
		};
	};
</script>

<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { Article } from '@prisma/client';
	export let articles: Article[] = [];
</script>

<form class="space-y-4" action="/lists" method="POST">
	<label>
		Name
		<input type="text" name="name" /></label
	>
	<div class="flex flex-col">
		{#each articles as { title, id }}
			<label>
				<input type="checkbox" name="articles" value={id} />
				{title}
			</label>
		{/each}
	</div>
	<Button type="submit">Submit</Button>
</form>
