<script lang="ts">
	import Input, { inputVariants } from "./ui/Input.svelte";
	import { cn } from "$lib/utils/tailwind";
	import { ComponentProps, tick } from "svelte";
	import { md } from "$lib/markdown";
	import Textarea from "./ui/Textarea.svelte";

    

    type TAs = $$Generic<'input' | 'textarea'>;
    export let as: TAs = 'input' as TAs;
    $: component = as === 'input' ? Input : Textarea;
    export let active = false;

    export let value = '';

    type $$Props = {
        as?: TAs;
        value?: string;
        active?: boolean;
        placeholder?: string;
    } & ComponentProps<TAs extends 'input' ? Input :  Textarea>;
    let input: HTMLInputElement;

    $: console.log(md.render(value))

    function handle_click(e: Event) {
        console.log({e})
            active = true;
    }

    export let placeholder ='';


    $: if (active) {
        tick().then(() => {
            input?.focus();
        })
    }


</script>

<svelte:head>
    <!-- katex css -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous">
</svelte:head>
<!-- TODO: render markdown when not focused, otherwise input with markdown -->


{#if !active && value}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class={cn(inputVariants({variant: "naked"}), 'leading-tight items-center cursor-text not-prose')} on:focus={(e) => {
    active = true;
    tick().then(() => {

    })
}}  on:pointerdown|preventDefault|stopPropagation={handle_click}  tabindex={0}>
    {@html md.render(value)}
    <!-- {value} -->
</div>
{:else}
    <slot {value}>
        <svelte:component  this={component} {placeholder} class="leading-tight" variant='naked'  bind:ref={input} on:blur={() => active = false} on:focus={() => active = true} bind:value {...$$restProps}  />
    </slot>
    {/if}


    <!-- <div contenteditable="true">
        {value}
    </div> -->