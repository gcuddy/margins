<script lang="ts">
	import { Button } from '../button/index.js';
	import { autosize, cn } from '@margins/lib';
	let className: string | null | undefined = undefined;
	export { className as class };
	export let value = '';
	export let placeholder = '';
	export let onSave: (value: string) => void = () => {};
</script>

<div
	class={cn(
		'bg-background-elevation2 ring-glass/5 group m-0 rounded-lg px-4 py-3 ring-1 ring-inset transition',
		className,
	)}
>
	<textarea
		rows={1}
		use:autosize
		{placeholder}
		{...$$restProps}
		bind:value
		class={cn(
			'peer resize-none bg-transparent focus-visible:shadow focus-visible:outline-none focus-visible:ring-0',
		)}
	/>
	<div class="flex justify-end">
		<Button
			on:click={() => onSave(value)}
			size="sm"
			class="h-auto px-2 py-1.5 brightness-50 transition group-focus-within:brightness-90"
			>Save</Button
		>
	</div>
</div>
