<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { ctx } from './ctx';
	import { generateId } from '@melt-ui/svelte/internal/helpers';
	import { cn } from '$lib/utils';

	const {
		helpers,
		state: { inputValue, filtered, shouldFilter }
	} = ctx.get();
	const id = generateId();
	const headingId = `${id}-heading`;

	export let heading: string | undefined = undefined;
	export let value: string | undefined = undefined;
	export let alwaysShow = false;

	let className = '';
	export { className as class };
	export let unstyled = false;

	let containerEl: HTMLDivElement;
	let headingEl: HTMLDivElement;

	// set groupId in context for children
	setContext('command_groupId', id);

	onMount(() => {
		const unMount = helpers.registerGroup(id);

		const computedValue = value || heading ? heading : headingEl?.textContent?.trim().toLowerCase();
		if (computedValue) {
			helpers.registerItemValue(id, computedValue);
			containerEl?.setAttribute('data-value', computedValue);
		}

		return () => {
			unMount();
		};
	});

	$: render =
		alwaysShow || ($shouldFilter === false ? true : !$inputValue ? true : $filtered.groups.has(id));
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
	hidden={render ? undefined : true}
>
	{#if heading || $$slots.heading}
		<div bind:this={headingEl} data-command-group-heading aria-hidden id={headingId}>
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
