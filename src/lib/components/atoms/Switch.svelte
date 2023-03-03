<script lang="ts">
	import { Switch, SwitchLabel, SwitchGroup } from '@rgossiaux/svelte-headlessui';
	export let enabled = false;
	export let label: string;
</script>

<SwitchGroup>
	<div class="flex items-center space-x-3 text-sm">
		<SwitchLabel class="">{label}</SwitchLabel>
		<Switch
			checked={enabled}
			on:change={(e) => (enabled = e.detail)}
			on:change
			class="{enabled
				? 'bg-primary-600'
				: 'bg-gray-400'} relative inline-flex h-5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-opacity-75"
		>
			<span class="sr-only">Enable {label}</span>
			<span
				aria-hidden="true"
				class="{enabled
					? 'translate-x-3'
					: 'translate-x-0'} pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
			/>
		</Switch>
	</div>
</SwitchGroup>
