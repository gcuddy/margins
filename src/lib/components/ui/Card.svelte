<script lang="ts">
	import { SlotProp, cs } from '$lib';
	import { cn } from '$lib/utils/tailwind';
	import type { HTMLBaseAttributes } from 'svelte/elements';

	type Props = {
		class?: string;
		header?: SlotProp;
		title?: SlotProp;
		description?: SlotProp;
		content?: SlotProp;
		footer?: SlotProp;
	} & HTMLBaseAttributes;

	interface $$Props extends Props {}
	let class_name = '';
	export { class_name as class };

	export let header: SlotProp = '';
	export let title: SlotProp = '';
	export let description: SlotProp = '';
	export let content: SlotProp = '';
	export let footer: SlotProp = '';
</script>

<div
	class={cn('rounded-lg border bg-card text-card-foreground shadow-sm', class_name)}
	{...$$restProps}
>
	<slot name="header-wrapper">
		{#if $$slots.header || $$slots.title || $$slots.description}
			<div {...cs(header, 'flex flex-col space-y-1.5 p-6')}>
				<slot name="header">
					{#if $$slots.title}
						<h3 {...cs(title, 'text-lg font-semibold leading-none tracking-tight')}>
							<slot name="title" />
						</h3>
					{/if}
					{#if $$slots.description}
						<p {...cs(description, 'text-sm text-muted-foreground')}>
							<!-- <p class={cn("text-sm text-muted-foreground", slot_class(description))}> -->
							<slot name="description" />
						</p>
					{/if}
				</slot>
			</div>
		{/if}
	</slot>
	{#if $$slots.default}
		<div {...cs(content, 'p-6', $$slots.header && 'pt-0')}>
			<slot />
		</div>
	{/if}
	{#if $$slots.footer}
		<div {...cs(footer, 'flex items-center p-6 pt-0')}>
			<slot name="footer" />
		</div>
	{/if}
</div>
