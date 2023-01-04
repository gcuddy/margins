<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>All</h1>

{#each data.entries as entry}
	<a href="/u:{data.user.username}/entry/{entry.id}">{entry.title}</a>
{/each}
