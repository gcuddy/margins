<script lang="ts">
	export let checked = false;
	export let name: string | undefined = undefined;
	export let id: string | undefined = undefined;
	export let value: string | undefined = undefined;
</script>

<input
	type="checkbox"
	bind:checked
	{name}
	{id}
	{value}
	class="rounded bg-transparent text-amber-600 focus:outline-none focus:ring-1 focus:ring-amber-300 focus:ring-offset-0"
/>
