<script>
	import Sun from 'lucide-svelte/icons/sun';
	import MoonIcon from 'lucide-svelte/icons/moon';
	import { mode, toggleMode } from 'mode-watcher';
</script>

<button
	data-testid="theme-toggle"
	on:click={toggleMode}
	class="relative flex items-center gap-2 rounded-full border p-1"
>
	<span data-active={$mode === 'dark'} class="rounded-full p-1">
		<MoonIcon class="h-4 w-4" />
		<span class="sr-only">dark mode</span>
	</span>
	<span data-active={$mode === 'light'} class="rounded-full p-1">
		<Sun class="h-4 w-4" />
		<span class="sr-only">light mode</span>
	</span>
</button>

<style>
	[data-active='true'] {
		background-color: hsl(var(--secondary));
		color: hsl(var(--foreground));
	}
</style>
