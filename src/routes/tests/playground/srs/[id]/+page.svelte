<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$components/ui/Button.svelte';
	import { md } from '$lib/markdown';
	import { CheckCircle2Icon, CircleSlashIcon, EyeIcon } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import Card from '../Card.svelte';

    export let data;

    // TODO: use url params for js-free (or post answer and get from cookies or something)
    let show_answer = false;

    export let form;
    $: console.log({form, note: data.note});

</script>


<Card note={data.note} />

<!-- <div>
{@html md.render(data.note.body ?? '')}


Next due: {data.note.due_timestamp}
</div>

{#if show_answer}

<div in:fly>
    {@html md.render(data.note.response ?? '')}
</div>
<form use:enhance action="?/mark" method="post">
<Button name="remembered" value={0} type="submit">
    <CircleSlashIcon class="h-5 w-5 mr-2" />
    Forgotten
</Button>
<Button name="remembered" value={1} type="submit">
    <CheckCircle2Icon class="h-5 w-5 mr-2" />
    Remembered
</Button>
</form>

{:else}

<Button on:click={() => {
    show_answer = true;
}} size='lg'>
    <EyeIcon class="h-5 w-5 mr-2" />
    Show Answer
</Button>

{/if} -->
