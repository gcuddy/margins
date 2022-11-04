<script>
	import { enhance } from '$app/forms';
	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<form method="post" use:enhance>
	<input type="file" name="file" id="file" accept=".mp3" />
	<button type="submit">Submit</button>
</form>
<div>
	{#if form}
		<h1>{form.title}</h1>
		<h2>{form.artist}</h2>
		<h2>{form.album}</h2>
	{/if}
</div>
