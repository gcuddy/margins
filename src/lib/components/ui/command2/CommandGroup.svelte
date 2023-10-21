<script lang="ts">
	import { generateId } from '@melt-ui/svelte/internal/helpers';
	import { setContext, tick } from 'svelte';

	import { getOptions } from '$lib/helpers';
	import { cn } from '$lib/utils';

	import { ctx } from './ctx';

	const {
		state: { inputValue, shouldFilter }
	} = ctx.get();
	const id = generateId();
	const headingId = `${id}-heading`;

	export let heading: string | undefined = undefined;

	let className = '';
	export { className as class };
	export let unstyled = false;

	export let containerEl: HTMLDivElement | undefined = undefined;

	// set groupId in context for children
	setContext('command_groupId', id);

    let hidden = false;

    $: if ($inputValue && $shouldFilter !== false) {
        // eslint-disable-next-line unicorn/prefer-top-level-await
        tick().then(() => {
            const options = getOptions(containerEl);
            const allHidden = options.every((option) => option.hidden);
            hidden = allHidden;
        })
    } else {
        hidden = false;
    }
</script>

<div
	bind:this={containerEl}
	class={cn(
		!unstyled &&
			'overflow-hidden p-1 text-foreground [&_[data-command-group-heading]]:px-2 [&_[data-command-group-heading]]:py-1.5 [&_[data-command-group-heading]]:text-xs [&_[data-command-group-heading]]:font-medium [&_[data-command-group-heading]]:text-muted-foreground',
		className
	)}
	data-command-group
	{id}
	role="presentation"
	hidden={hidden}
>
	{#if heading || $$slots.heading}
		<div data-command-group-heading aria-hidden id={headingId}>
			{#if heading}
				{heading}
			{:else}
				<slot name="heading" />
			{/if}
		</div>
	{/if}
	<div role="group" data-command-group-items aria-labelledby={heading ? headingId : undefined}>
		<slot />
	</div>
</div>
