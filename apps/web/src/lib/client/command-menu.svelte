<script lang="ts">
	import { onMount } from 'svelte';
	import { mainCommandState } from './stores/command-state';
	import { Command } from '@margins/ui';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { setMode } from 'mode-watcher';

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
</script>

<Command.Dialog bind:open={$mainCommandState.open}>
	<Command.Input placeholder="Type a command or search" />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
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
	</Command.List>
</Command.Dialog>
