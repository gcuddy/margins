<script lang="ts">
	import type { OnChangeFn } from '@huntabyte/primitives/dist/internal';

	import { badgeVariants } from '$components/ui/Badge.svelte';
	import { Select, SelectContent, SelectGroup, SelectItem } from '$components/ui/select';
	import { cn } from '$lib/utils';
	import { Select as SelectPrimitive } from '@huntabyte/primitives';
	import { melt } from '@melt-ui/svelte';
	import { ctx } from '../ctx';

	const c= ctx.get();
    $: console.log({c});

    type T = $$Generic

	export let value: T | undefined = undefined;

	export let choices: {
		name: string;
		value: string;
		disabled?: boolean;
	}[] = [];

    export let onValueChange: OnChangeFn<T> | undefined = undefined;
</script>

<!-- portal={$container} -->
<Select
	positioning={{
		placement: 'bottom-start'
	}}
	bind:value
    {onValueChange}
>
	<SelectPrimitive.Trigger let:builder asChild>
		<div
			use:melt={builder}
			class={cn(
				badgeVariants({
					variant: 'outline'
				}),
				'rounded-none'
			)}
		>
			<slot>
				{value ?? 'Select'}
			</slot>
		</div>
	</SelectPrimitive.Trigger>
	<SelectContent>
		<SelectGroup>
			{#each choices as { value, name, disabled }}
				<SelectItem {disabled} {value}>{name}</SelectItem>
			{/each}
		</SelectGroup>
	</SelectContent>
</Select>
