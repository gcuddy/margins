<script lang="ts">
	import { cn } from '$lib/utils';
	import { ctx } from './ctx';
	import type { CommandProps } from './store';
	import type { RootProps } from './types';
	import { createPages, type PageType } from './utils';

	type $$Props = RootProps & {
		initialPages?: TPages[];
		pages?: TPages[];
		bounce?: boolean;
    } & MultipleValue;

    type MultipleValue = {
        multiple: true;
        value?: string[];
    } | {
        multiple?: false;
        value?: string;
    }

	export let value: $$Props["value"] = undefined;
	export let multiple: $$Props['multiple'] = false;

	export let asChild = false;
	export let unstyled = false;
	let className: $$Props['class'] = undefined;
	export { className as class };

	const {
		state: { selectedValue, inputValue },
		elements: { container }
	} = ctx.set({
		defaultSelectedValue: value ? [value] : [],
		multiple
	});

	$: value =  $selectedValue[0];
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
		<slot page={$pageStore} pageName={$pageStore?.name} pages={pageStore} />
	</div>
{/if}
