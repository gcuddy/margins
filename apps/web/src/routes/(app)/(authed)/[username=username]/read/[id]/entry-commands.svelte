<script lang="ts">
	import { mainCommandState } from '$lib/client/stores/command-state';
	import { Command } from '@margins/ui';
	import type { Command as CommandType } from '@margins/features/commands';
	import Inbox from 'lucide-svelte/icons/inbox';
	import LocationCommands from './entry-location-commands.svelte';
	import { createLocationCommands } from './commands';
	import { getReplicache } from '@margins/features/replicache';
	import { derived } from 'svelte/store';
	import commandScore from 'command-score';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import { onDestroy } from 'svelte';

	const rep = getReplicache();

	export let id: string;

	const { setMenu } = mainCommandState.registerMenu('change-location', {
		content: LocationCommands,
		contentProps: { id },
		placeholder: 'Change location…',
	});
	const locationCommands = createLocationCommands(rep, id);

	const peekCommands = derived([mainCommandState], ([$mainCommandState]) => {
		if ($mainCommandState.input.length === 0) {
			return [];
		}

		const output: (CommandType & {
			prefix: string;
			score: number;
		})[] = [];

		for (const command of locationCommands) {
			const score = commandScore(command.label, $mainCommandState.input);
			if (score > 0.1) {
				output.push({
					...command,
					prefix: 'Change location',
					score,
				});
			}
		}

		return output.sort((a, b) => b.score - a.score);
	});

	onDestroy(() => {
		console.log('<Entry-commands /> destroyed');
		// removeMenu();
	});
</script>

<Command.Item
	onSelect={() => {
		setMenu('change-location', {
			bounce: true,
		});
	}}
>
	<Command.Icon icon={Inbox} />
	Change Location
</Command.Item>

{#if $mainCommandState.input.length > 1}
	{#each $peekCommands as command}
		<Command.Item
			onSelect={() => {
				mainCommandState.run(command.action);
			}}
			value={command.label}
			alwaysRender
		>
			<Command.Icon icon={command.icon} />
			<div class="flex items-center gap-2">
				<span>{command.prefix}</span>
				<ChevronRight class="text-muted-foreground h-3 w-3 stroke-[1.5]" />
				<span>Change to {command.label}</span>
			</div>
		</Command.Item>
	{/each}
{/if}
