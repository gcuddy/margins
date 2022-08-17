<script lang="ts">
	import { Switch, SwitchLabel, SwitchGroup } from '@rgossiaux/svelte-headlessui';
	export let enabled = false;
	export let label: string;
	export let sr = `Enable ${label}`;
	let className = '';
	export { className as class };
</script>

<SwitchGroup>
	<div class={className}>
		<SwitchLabel class="grow">{label}</SwitchLabel>
		<Switch
			checked={enabled}
			on:change={(e) => (enabled = e.detail)}
			class="{enabled
				? 'bg-lime-600 active:bg-lime-700'
				: 'bg-gray-400 active:bg-gray-500'} relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-opacity-75 "
		>
			<span class="sr-only">{sr}</span>
			<span
				aria-hidden="true"
				class="{enabled
					? 'translate-x-3'
					: 'translate-x-0'} pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
			/>
		</Switch>
	</div>
</SwitchGroup>
