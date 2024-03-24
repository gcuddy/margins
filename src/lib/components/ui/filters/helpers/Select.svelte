<script lang="ts">
	import type { ComponentType } from 'svelte';

	import { badgeVariants } from '$components/ui/badge';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectValue,
	} from '$components/ui/select';
	import { cn } from '$lib/utils';
	import { Select as SelectPrimitive } from 'bits-ui';
	import { type SelectOption, melt } from '@melt-ui/svelte';
	import { ctx } from '../ctx';

	const c = ctx.get();
	$: console.log({ c });

	type T = $$Generic;

	export let selected: SelectOption<T> | undefined = undefined;

	export let choices: Array<SelectOption<T> & { icon?: ComponentType }> = [];
	type OnChangeFn<T> = (val: T) => void;

	export let onSelectedChange: OnChangeFn<SelectOption<T>> | undefined =
		undefined;
</script>

<!-- portal={$container} -->
<Select
	positioning={{
		placement: 'bottom-start',
	}}
	bind:selected
	onSelectedChange={(val) => {
		// @ts-expect-error (fine)
		onSelectedChange?.(val);
	}}
>
	<SelectPrimitive.Trigger let:builder asChild>
		<div
			use:melt={builder}
			class={cn(
				badgeVariants({
					variant: 'outline',
				}),
				'cursor-default rounded-none focus:ring-0 hocus:bg-secondary',
			)}
		>
			<slot>
				<!-- {selected?.label ?? 'Select'} -->
				<SelectValue />
			</slot>
		</div>
	</SelectPrimitive.Trigger>
	<SelectContent>
		<SelectGroup>
			{#each choices as { value, label, icon }}
				<SelectItem {label} {value}>
					{#if icon}
						<svelte:component this={icon} class="mr-2 h-4 w-4" />
					{/if}
					{label}</SelectItem
				>
			{/each}
		</SelectGroup>
	</SelectContent>
</Select>
