<script lang='ts'>
	import { Star, StarFilled } from "radix-icons-svelte";

    export let rating = 0;
</script>

<div class="flex">
    {#each Array.from({ length: rating }) as _}
        <StarFilled />
    {/each}
    {#each Array.from({ length: 5 - rating }) as _}
        <Star class="opacity-20" />
    {/each}
</div>
