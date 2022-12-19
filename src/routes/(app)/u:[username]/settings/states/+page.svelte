<script>
	import { page } from '$app/stores';
	import MiniSelect from '$lib/components/atoms/MiniSelect.svelte';
	import Button from '$lib/components/Button.svelte';
	import { Location } from '@prisma/client';
</script>

<p>States allow you to define how Margins should classify your saved items.</p>
{$page.data.user?.default_state_id}
<ul>
	{#each $page.data.user?.states || [] as state}
		<form class="flex">
			<input type="text" name="" id="" value={state.name} />
			{#if state.id === $page.data.user?.default_state_id}
				default
			{/if}
			<MiniSelect value={state.type}>
				{#each Object.keys(Location) as location}
					<option>{location}</option>
				{/each}
			</MiniSelect>
			<li>{state.name} - {state.type} - {state.read_later}</li>
		</form>
		<form action="?/makeDefault" method="post">
			<input type="hidden" name="id" value={state.id} />
			<Button type="submit">Make default</Button>
		</form>
	{/each}
</ul>
