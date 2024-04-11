<script lang="ts">
	import { page } from '$app/stores';
	import { Command } from '@margins/ui';
	import { NavigationCommand } from '../command-utils';
	import ArrowRight from 'lucide-svelte/icons/arrow-right';
	import { mainCommandState } from '../stores/command-state';
	const commands = [
		NavigationCommand({
			category: 'App',
			path: `/u:${$page.data.user!.username}/backlog`,
			title: 'Go to Backlog',
		}),
		NavigationCommand({
			category: 'App',
			path: `/u:${$page.data.user!.username}/now`,
			title: 'Go to Now',
		}),
		NavigationCommand({
			category: 'App',
			path: `/u:${$page.data.user!.username}/done`,
			title: 'Go to Done',
		}),
	];
</script>

{#each commands as command}
	<Command.Item value={command.label} onSelect={command.action}>
		<svelte:component
			this={command.icon}
			class="group-data-[selected=true]:text-accent-foreground text-muted-foreground/80 mr-2 h-4 w-4"
		/>
		{command.label}
	</Command.Item>
{/each}
<Command.Separator class="my-2" />
<Command.Item
	onSelect={() => {
		mainCommandState.setMenu('library-items', {
			bounce: true,
		});
	}}
>
	<ArrowRight
		class="group-data-[selected=true]:text-accent-foreground text-muted-foreground/80 mr-2 h-4 w-4"
	/>
	Open item
</Command.Item>
