<script>
    export let data;
</script>


{#each data.tags as tag}
    <div>
        <a href="/tests/playground/tags/{tag.name}">{tag.name}</a>
    </div> 
{/each}