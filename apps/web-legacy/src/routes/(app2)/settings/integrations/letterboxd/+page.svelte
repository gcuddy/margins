<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';
	import Label from '$components/ui/Label.svelte';

	import DataTable from './data-table.svelte';

	export let form;

	let loading = false;
</script>

{#if form && 'films' in form && form.films}
	<DataTable films={form.films} />
{:else}
	<form
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
		method="post"
		action="?/importFeed"
	>
		<Label for="username">Username</Label>
		<Input id="username" name="username" placeholder="Username" />
		<Button disabled={loading} type="submit">Import</Button>
	</form>
{/if}
