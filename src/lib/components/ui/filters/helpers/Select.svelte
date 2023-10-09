<script lang="ts">
	import type { ComponentType } from 'svelte';
	import type { OnChangeFn } from '@huntabyte/primitives/dist/internal';

	import { badgeVariants } from '$components/ui/Badge.svelte';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectValue,
	} from '$components/ui/select';
	import { cn } from '$lib/utils';
	import { Select as SelectPrimitive } from '@huntabyte/primitives';
	import { type SelectOption, melt } from '@melt-ui/svelte';
	import { ctx } from '../ctx';

	const c = ctx.get();
	$: console.log({ c });

	type T = $$Generic;

	export let selected: SelectOption<T> | undefined = undefined;

	export let choices: Array<SelectOption<T> & { icon?: ComponentType }> = [];

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
				'rounded-none cursor-default hocus:bg-secondary focus:ring-0',
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
						<svelte:component this={icon} class="h-4 w-4 mr-2" />
					{/if}
					{label}</SelectItem
				>
			{/each}
		</SelectGroup>
	</SelectContent>
</Select>
