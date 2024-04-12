<script lang="ts">
	import { onMount } from 'svelte';
	import { mainCommandState } from './stores/command-state';
	import { Command } from '@margins/ui';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { setMode } from 'mode-watcher';
	import Navigation from './commands/navigation.commands.svelte';
	// import { createState } from "cmdk-sv";

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			$mainCommandState.open = !$mainCommandState.open;
		}
		if ($mainCommandState.open && e.key === 'Escape') {
			e.preventDefault();
			$mainCommandState.open = false;
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	const { containerEl, createPlaceholder, currentMenu, registeredActions } =
		mainCommandState;

	const placeholder = createPlaceholder('Type a command or search');

	// hacky way to reset the command menu when the dialog closes
	$: if (!$mainCommandState.open) {
		setTimeout(mainCommandState.reset, 1);
	}

	$: console.log({ $containerEl });
</script>

<Command.Dialog bind:el={$containerEl} bind:open={$mainCommandState.open}>
	<Command.Input
		bind:value={$mainCommandState.input}
		placeholder={$placeholder}
	/>
	<Command.List>
		{#if !$currentMenu}
			<Command.Empty>No results found.</Command.Empty>
			{#if $registeredActions.length}
				<!-- TODO: heading -->
				<Command.Group>
					{#each $registeredActions as action}
						<Command.Item value={action.label} onSelect={action.action}>
							{action.label}
						</Command.Item>
					{/each}
				</Command.Group>
			{/if}
			<Command.Group heading="Theme">
				<Command.Item
					value="light"
					onSelect={() => mainCommandState.run(() => setMode('light'))}
				>
					<Sun class="mr-2 h-4 w-4" />
					Light
				</Command.Item>
				<Command.Item
					value="dark"
					onSelect={() => mainCommandState.run(() => setMode('dark'))}
				>
					<Moon class="mr-2 h-4 w-4" />
					Dark
				</Command.Item>
				<!-- <Command.Item value="system" onSelect={() => runCommand(() => resetMode())}>
				<Laptop class="mr-2 h-4 w-4" />
				System
			</Command.Item> -->
			</Command.Group>
			<Command.Group heading="Navigation">
				<Navigation />
			</Command.Group>
		{:else}
			<svelte:component this={$currentMenu.content} />
		{/if}
	</Command.List>
</Command.Dialog>
