<script lang="ts">
	/** Hex code representation of color */
	export let color: string;

	import * as Command from '$components/ui/command2';
	import * as Popover from '$components/ui/popover';
	import { melt } from '@melt-ui/svelte';
	import { createEventDispatcher, tick } from 'svelte';

	const colors = [
		{ label: 'Default', value: '#000000' },
		{
			label: 'Red',
			value: '#EF4444'
		},
		{
			label: 'Blue',
			value: '#3B82F6'
		},
		{
			label: 'Green',
			value: '#10B981'
		},
		{
			label: 'Yellow',
			value: '#F59E0B'
		},
		{
			label: 'Purple',
			value: '#8B5CF6'
		},
		{
			label: 'Pink',
			value: '#EC4899'
		},
		{
			label: 'Orange',
			value: '#F97316'
		},
		{
			label: 'Teal',
			value: '#14B8A6'
		},
		{
			label: 'Indigo',
			value: '#6366F1'
		},
		{
			label: 'Cyan',
			value: '#06B6D4'
		}
		// Add more colors as needed
	];

	// TODO: custom color

    let open = false;
    const dispatch = createEventDispatcher<{
        change: string;
    }>();

</script>
<!-- TODO: server action -->
<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<div
			use:melt={builder}
			data-color={colors.find((c) => c.value === color)?.label}
			class="h-5 w-5 rounded-full"
			style:--color={color}
		/>
	</Popover.Trigger>
	<Popover.Content class="p-0 w-fit">
		<Command.Root bind:value={color} class="bg-inherit" onClose={() => {
            console.log('closing')
            tick().then(() => {
                open = false;
                dispatch('change', color)
            })
        }}>
			<Command.Input placeholder="Select color…" />
			<Command.List>
				<Command.Group>
					{#each colors as { label, value } (label)}
						<Command.RadioItem {value} valueToString={() => label}>
							<div class="h-5 w-5 rounded-full" style:background-color={value} />
							<span class="ml-2">{label}</span>
						</Command.RadioItem>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

<style>
	[data-color] {
		background-color: var(--color);
	}

	:global(.dark) [data-color='Default'] {
		background-color: #ffffff;
	}

	@media (prefers-color-scheme: dark) {
		[data-color='Default'] {
			background-color: #ffffff;
		}
	}
</style>
