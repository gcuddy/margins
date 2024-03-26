<script lang="ts">
	import { type ComponentProps, tick } from 'svelte';

	import { md } from '$lib/markdown';
	import { cn } from '$lib/utils/tailwind';

	import Input from './ui/input/input.svelte';
	import Textarea from './ui/Textarea.svelte';

	type TAs = $$Generic<'input' | 'textarea'>;
	export let as: TAs = 'input' as TAs;
	$: component = as === 'input' ? Input : Textarea;
	export let active = false;

	export let value = '';
    export let editable = true;

	type $$Props = {
		active?: boolean;
		as?: TAs;
		editable?: boolean;
		placeholder?: string;
        value?: string;
	} & ComponentProps<TAs extends 'input' ? Input : Textarea>;
	let input: HTMLInputElement;

	function handle_click(e: Event) {
        console.log({e, editable})
        if (!editable) {return;}
		console.log({ e });
		active = true;
	}

	export let placeholder = '';

	$: if (active) {
		tick().then(() => {
			input.focus();
		});
	}
</script>

<svelte:head>
	<!-- katex css -->
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
		integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn"
		crossorigin="anonymous"
	/>
</svelte:head>
<!-- TODO: render markdown when not focused, otherwise input with markdown -->

{#if !active && value}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
	<div
		class={cn(
			'border-none',
			'leading-tight items-center cursor-text not-prose h-auto',
            $$props.class
		)}
		on:focus={(e) => {
			active = true;
			tick().then(() => {});
		}}
		on:pointerdown|preventDefault|stopPropagation={handle_click}
		tabindex={0}
	>
		{@html md.render(value)}
		<!-- {value} -->
	</div>
	{#if $$props.name}
		<input type="hidden" name={$$props.name} {value} />
	{/if}
{:else}
	<slot {value}>
		<svelte:component
			this={component}
			{placeholder}
			class={cn('leading-tight', $$props.class)}
			variant="naked"
			bind:ref={input}
            on:blur
			on:blur={() => (active = false)}
			on:focus={() => (active = true)}
            on:keydown
			bind:value
			{...$$restProps}
		/>
	</slot>
{/if}

<!-- <div contenteditable="true">
        {value}
    </div> -->
