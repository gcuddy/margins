<script lang="ts">
	import { Switch, SwitchLabel, SwitchGroup } from '@rgossiaux/svelte-headlessui';
	export let enabled = false;
	export let label: string;
	export let sr = `Enable ${label}`;
	let className = '';
	export { className as class };
	export let labelOnRight = false;
	export let name: string | undefined = undefined;
	export let size: 'xs' | 'sm' = 'sm';
</script>

<SwitchGroup>
	<div class={className}>
		{#if !labelOnRight}
			<SwitchLabel class="grow">{label}</SwitchLabel>
		{/if}

		<Switch
			checked={enabled}
			on:change={(e) => (enabled = e.detail)}
			class="{enabled
				? 'bg-accent active:bg-accent/80'
				: 'bg-gray-400 active:bg-gray-500'} relative inline-flex {size === 'sm'
				? 'h-4 w-7'
				: 'h-3 w-5'} shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-opacity-75 "
		>
			{#if name}
				<input type="hidden" {name} value="on" />
			{/if}
			<span class="sr-only">{sr}</span>
			<span
				aria-hidden="true"
				class="{enabled
					? `${size === 'sm' ? 'translate-x-3' : 'translate-x-2'}`
					: 'translate-x-0'} pointer-events-none inline-block {size === 'sm'
					? 'h-3 w-3'
					: 'h-2 w-2'}  transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
			/>
		</Switch>
		{#if labelOnRight}
			<SwitchLabel class="grow">{label}</SwitchLabel>
		{/if}
	</div>
</SwitchGroup>
