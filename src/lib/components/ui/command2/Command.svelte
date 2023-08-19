<script lang="ts">
	import { cn } from '$lib/utils';
	import { ctx } from './ctx';
	import type { CommandProps } from './store';
	import type { RootProps } from './types';
	import { createPages, type PageType } from './utils';

	type SingleValue = {
		multiple?: false;
		value?: T;
	};

	type MultipleValue = {
		multiple: true;
		value?: T[];
	};

	type SingleOrMultipleValue = SingleValue | MultipleValue;

	type $$Props = RootProps & {
		initialPages?: TPages[];
		pages?: TPages[];
		bounce?: boolean;
		// multiple?: boolean;
		// value?: T[];
		/**
		 * Prop to pass in a value that represents the generic type. Doesn't do anything beyond that.
		 */
		type?: T;
	} & SingleOrMultipleValue &
		Omit<CommandProps<T>, 'multiple'>;

	// & MultipleValue;

	// type MultipleValue =
	// 	| {
	// 			multiple: true;
	// 			value?: string[];
	// 	  }
	// 	| {
	// 			multiple?: false;
	// 			value?: string;
	// 	//   };

	export let value: $$Props['value'] = undefined;
	export let valueToString: $$Props['valueToString'] = undefined;
	let _selectedValue: $$Props['selectedValue'] = undefined;
	export { _selectedValue as selectedValue };
	export let multiple: $$Props['multiple'] = false;
	export let onClose: $$Props['onClose'] = undefined;
	export let asChild = false;
	export let unstyled = false;
	export let initialData: $$Props['initialData'] = undefined;
	export let type: $$Props['type'] = undefined;
    export let comparisonFunction: $$Props['comparisonFunction'] = undefined;
	type;
	let className: $$Props['class'] = undefined;
	export { className as class };

	type T = $$Generic;

	const {
		state: { selectedValue, inputValue, filtered },
		elements: { container },
	} = ctx.set<T>({
		initialSelectedValue:
			value && multiple && Array.isArray(value)
				? value
				: !multiple && value && !Array.isArray(value)
				? [value]
				: undefined,
		multiple,
		valueToString,
		selectedValue: _selectedValue,
		onClose,
		initialData,
        comparisonFunction
	});

	$: value = multiple ? $selectedValue : $selectedValue[0];
	type TPages = $$Generic<PageType>;
	export let initialPages: TPages[] | undefined = undefined;
	let pagesData: TPages[] = [];
	export { pagesData as pages };
	export let bounce = false;
	export let pageStore = createPages({
		initialPages: initialPages,
		pages: pagesData,
		container,
		onPageChange: () => {
			$inputValue = '';
		},
		playBounce: bounce
	});
</script>

{#if asChild}
	<slot />
{:else}
	<div
		bind:this={$container}
		class={cn(
			!unstyled &&
				'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
			bounce && 'transition-transform',
			className
		)}
	>
		<slot createPageItems={pageStore.helpers.createItems} filtered={$filtered} page={$pageStore} pageName={$pageStore?.name} pages={pageStore} inputValue={$inputValue} />
	</div>
{/if}
