<script lang="ts">
	/** Hex code representation of color */
	export let color: string;

	import * as Command from '$components/ui/command2';
	import * as Popover from '$components/ui/popover';
	import { Popover as PopoverPrimitive } from 'bits-ui';
	import { melt } from '@melt-ui/svelte';
	import { createEventDispatcher, tick } from 'svelte';
	import { TagIcon } from 'lucide-svelte';
	import { Pill, colors } from '.';

	let open = false;
	const dispatch = createEventDispatcher<{
		change: string;
	}>();
</script>

<!-- TODO: server action -->
<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Pill {color} {builder} />
	</Popover.Trigger>
	<Popover.Content class="p-0 w-fit">
		<PopoverPrimitive.Arrow class="border-t border-l" />
		<Command.Root
			bind:value={color}
			class="bg-inherit"
			onClose={() => {
				console.log('closing');
				tick().then(() => {
					open = false;
					dispatch('change', color);
				});
			}}
		>
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
