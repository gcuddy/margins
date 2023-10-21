<script lang="ts">
	import { melt } from '@melt-ui/svelte';
	import { Select as SelectPrimitive } from 'bits-ui';
	import type { OnChangeFn } from 'bits-ui/dist/internal';

	import { badgeVariants } from '$components/ui/badge';
	import * as Popover from '$components/ui/popover';
	import * as Command from '$components/ui/command2';
	import {
		Select,
		SelectContent,
		SelectGroup,
		SelectItem,
		SelectValue,
	} from '$components/ui/select';
	import { cn } from '$lib';

	import { ctx } from './ctx';

	let className: string | null | undefined = undefined;
	export { className as class };

	type T = $$Generic;

	type SelectOption = { label?: string; value: T };

	export let choices: Array<
		{
			disabled?: boolean;
		} & SelectOption
	> = [];

	export let selected: SelectOption | undefined = choices[0];

	export let onSelectedChange: OnChangeFn<SelectOption | undefined> = (
		value,
	) => {
		if (value) {
			onSelectedChange(value);
		}
	};

	// forgive me for this terrible hack
	function handleOnSelectedChange(val: any) {
		onSelectedChange(val);
	}

	const {
		elements: { container },
	} = ctx.get();

    // TODO: commands...
</script>

<Popover.Root>
	<Popover.Trigger let:builder asChild>
		<div
			use:melt={builder}
			class={cn(
				badgeVariants({
					variant: 'outline',
				}),
				'rounded-none',
				className,
			)}
		>
			<!-- Value -->
		</div>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0"></Popover.Content>
</Popover.Root>

<!-- TODO: fix type error -->
<Select
	portal={$container}
	positioning={{
		placement: 'bottom-start',
	}}
	{selected}
	onSelectedChange={handleOnSelectedChange}
>
	<SelectPrimitive.Trigger let:builder asChild>
		<div
			use:melt={builder}
			class={cn(
				badgeVariants({
					variant: 'outline',
				}),
				'rounded-none',
				className,
			)}
		>
			<SelectValue />
		</div>
	</SelectPrimitive.Trigger>
	<SelectContent>
		<SelectGroup>
			{#each choices as choice}
				<SelectItem {...choice}>{choice.label}</SelectItem>
			{/each}
		</SelectGroup>
	</SelectContent>
</Select>
