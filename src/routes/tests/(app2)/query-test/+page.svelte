<script lang="ts">
	import Input from "$lib/components/ui/Input.svelte";
	import { createQuery, keepPreviousData } from "@tanstack/svelte-query";
	import { writable } from "svelte/store";

    // mock sleep
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    let value = ''
    const options = writable({
        queryKey: ["search", value],
        queryFn: async ({
            queryKey
        }: {
            queryKey: string[]
        }) => {
            console.log({queryKey})
            await sleep(100);
            const res = await fetch(`https://jsonplaceholder.typicode.com/todos?title_like=${queryKey[1]}`);
            const data = await res.json() as Promise<{ title: string }[]>;
            console.log({data});
            return data;
        },
    })

    let query = createQuery(options);

    function update(e) {
        $options.queryKey[1] = e.target.value;
        // WEIRD HACK: need this to trigger reactivity
        query=query;
    }
    
</script>

<Input type="text" on:input={update} />

{#if $query.isLoading}
    <p>Loading...</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.data}
    {#each $query.data as todo}
        <p>{todo.title}</p>
    {/each}
{/if}