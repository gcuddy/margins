<script lang="ts" context="module">
	export const checkbox = cva(
		'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground'
	);
</script>

<script lang="ts">
	import { cn } from '$lib/utils/tailwind';

	import { CreateCheckboxProps, createCheckbox } from '@melt-ui/svelte';
	import { cva } from 'class-variance-authority';
	import { CheckIcon } from 'lucide-svelte';

	type $$Props = CreateCheckboxProps & {
		class?: string;
	};

	let _checked: $$Props['checked'] = false;

	export { _checked as checked };
	export let disabled: $$Props['disabled'] = false;
	export let name: $$Props['name'] = undefined;
	export let required: $$Props['required'] = false;
	export let value: $$Props['value'] = undefined;

	let className = '';
	export { className as class };

	const { root, input, isChecked, isIndeterminate, checked } = createCheckbox({
		checked: _checked,
		disabled,
		name,
		required,
		value
	});

	$: _checked = $isChecked;
</script>

<button on:click melt={$root} class={cn(checkbox(), className)}>
	{#if $isChecked}
		<span class="flex items-center justify-center text-current">
			<CheckIcon class="h-4 w-4" />
		</span>
	{/if}
	<!-- <slot /> -->
</button>
