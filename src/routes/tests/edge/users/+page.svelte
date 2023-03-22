<script lang="ts">
	export let data;
    $: console.log(data)
</script>

Test test
{#await data.lazy.tags then tags}
	{JSON.stringify(tags)}
{/await}
{#await data.lazy.states then tags}
	{JSON.stringify(tags)}
{/await}
