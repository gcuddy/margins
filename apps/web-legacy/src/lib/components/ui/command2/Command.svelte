<script lang="ts">
	import { type Writable, writable } from 'svelte/store';

	import { cn } from '$lib/utils';

	import { ctx } from './ctx';
	import type { RootCommandProps } from './types';
	import { createPages, type PageType } from './utils';

	type $$Props = RootCommandProps<T, TPages>;

	export let value: $$Props['value'] = undefined;
	export let valueToString: $$Props['valueToString'] = undefined;
	let _selectedValue: $$Props['selectedValue'] = undefined;
	export { _selectedValue as selectedValue };
	export let multiple: $$Props['multiple'] = false;
	export let onClose: $$Props['onClose'] = undefined;
	export let asChild = false;
	export let unstyled = false;
	export let initialData: $$Props['initialData'] = undefined;
	export let inputValue = writable('');
	// eslint-disable-next-line svelte/valid-compile
	export let type: $$Props['type'] = undefined;
	export let comparisonFunction: $$Props['comparisonFunction'] = undefined;
	let className: $$Props['class'] = undefined;
	export { className as class };
	export let defaultShouldFilter: $$Props['defaultShouldFilter'] = true;
	export let shouldFilter: $$Props['shouldFilter'] = undefined;
	export let container: $$Props['container'] = writable<HTMLElement | null>(
		null,
	);
	export let commandPages: $$Props['commandPages'] = undefined;
    export let filterFunction: $$Props['filterFunction'] = undefined;
    export let fixedHeight: $$Props["fixedHeight"] = false;
    export let loading: $$Props["loading"] = writable(false);
    export let placeholder: Writable<string | undefined> | undefined = undefined;

	type T = $$Generic;

	const {
		measurements: { tweenedHeight },
		state: { filtered, selectedValue, shouldFilter: localShouldFilter },
	} = ctx.set<T>({
		commandPages,
		comparisonFunction,
		container,
		defaultShouldFilter,
        filterFunction,
        fixedHeight,
		initialData,
		initialSelectedValue:
			value && multiple && Array.isArray(value)
				? value
				: !multiple && value && !Array.isArray(value)
				? [value]
				: undefined,
		inputValue,
        loading,
		multiple,
		onClose,
        placeholder,
		selectedValue: _selectedValue,
		shouldFilter,
		valueToString,
	});

	// TODO
	$: if (multiple) {
		value = $selectedValue.map((v) => v.value);
	} else if (!multiple && $selectedValue[0]?.value) {
		console.log({ $selectedValue });
		value = $selectedValue[0].value;
	}
	type TPages = $$Generic<PageType>;
	export let initialPages: Array<TPages> | undefined = undefined;
	let pagesData: Array<TPages> = [];
	export { pagesData as pages };
	export let bounce = false;
	export let pageStore = createPages({
		container,
		initialPages,
		onPageChange: () => {
			$inputValue = '';
		},
		pages: pagesData,
		playBounce: bounce,
		shouldFilterStore: localShouldFilter,
	});

    export let animateHeight = false;
</script>

{#if asChild}
	<slot />
{:else}
	<div
		data-command-root
		style:--height="{$tweenedHeight}px"
		bind:this={$container}
		class={cn(
			!unstyled &&
				'flex w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground will-change-transform trasnform-[0]',
			bounce && 'transition-transform',
            animateHeight && 'h-[--height]',
			className,
		)}
	>
		<slot
			createPageItems={pageStore.helpers.createItems}
			filtered={$filtered}
			page={$pageStore}
			pageName={$pageStore?.name}
			pages={pageStore}
			inputValue={$inputValue}
		/>
	</div>
{/if}
