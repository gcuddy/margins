<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { Button, Command, Popover } from '@margins/ui';
	import { addCommands } from '../commands/index.js';
	import score from 'command-score';

	let open = false;
	let value = '';
	const commands = addCommands({ prefix: '' });

	$: filteredAndSortedCommands = commands
		.map((command) => ({
			...command,
			score: score(command.label, value),
		}))
		.filter((command) => command.score > 0)
		.sort((a, b) => b.score - a.score);

	$: console.log({
		filteredAndSortedCommands,
	});

	$: if (open) {
		value = '';
	}
</script>

<svelte:window
	on:keydown={(e) => {
		if (open && e.key === 'Escape') {
			open = false;
		}
	}}
/>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			size="sm"
			role="combobox"
			aria-expanded={open}
			class="rounded-l-none border-l-0"
		>
			<ChevronDown class="h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root shouldFilter={false}>
			<Command.Input bind:value placeholder="Add new…" />
			<Command.Group>
				{#each filteredAndSortedCommands as command}
					<Command.Item
						onSelect={() => {
							command.action();
							open = false;
						}}
					>
						<svelte:component this={command.icon} class="mr-2 h-4 w-4" />
						{command.label}</Command.Item
					>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
