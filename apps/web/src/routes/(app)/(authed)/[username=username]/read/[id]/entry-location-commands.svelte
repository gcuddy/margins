<script lang="ts">
	import { Command } from '@margins/ui';
	import { getReplicache } from '@margins/features/replicache';
	import { createLocationCommands } from './commands';
	import { mainCommandState } from '$lib/client/stores/command-state';
	export let id: string;

	const rep = getReplicache();

	const commands = createLocationCommands(rep, id);
</script>

<Command.Group>
	{#each commands as command}
		<Command.Item
			id={command.id}
			onSelect={() => mainCommandState.run(command.action)}
		>
			<Command.Icon icon={command.icon} />
			{command.label}
		</Command.Item>
	{/each}
</Command.Group>
