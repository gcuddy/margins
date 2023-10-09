<script lang="ts">
	import {
		FIRST_LAST_KEYS,
		getOptions,
		isElementDisabled,
		next,
	} from '@melt-ui/svelte/internal/helpers';
	import { Search } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';

	import { isHTMLElement } from '$lib/helpers';
	import { cn } from '$lib/utils';

	import { ctx } from './ctx';
	import { INTERACTION_KEYS, kbd } from './store';
	import type { InputProps } from './types';

	type $$Props = InputProps;

	let inputEl: HTMLInputElement;
	const className: $$Props['class'] = undefined;
	export let unstyled = false;
	export let onKeydown: ((e: KeyboardEvent) => void) | undefined = undefined;

	export const focus = () => {
		inputEl?.focus();
	};

	const {
		actions,
		ids,
		measurements: { inputHeight },
		options,
		state: { activeElement, inputValue, open, selectedValue },
	} = ctx.get();

	function handleClick(e: MouseEvent) {
		if ($open) {
			return;
		}
		actions.openMenu($open);
	}

	let hasNavigated = false;

	function handleKeydown(
		e: KeyboardEvent & { currentTarget: EventTarget & HTMLInputElement },
	) {
		onKeydown?.(e);
		if (e.defaultPrevented) {
			return;
		}

		/**
		 * When the menu is closed...
		 */
		if (!$open) {
			if (INTERACTION_KEYS.includes(e.key)) {
				return;
			}

			// Tab should not open the menu.
			if (e.key === kbd.TAB) {
				return;
			}

			// Pressing backspace when the input is blank shouldn't open the menu.
			if (e.key === kbd.BACKSPACE && $inputValue === '') {
				return;
			}

			// All other events should open the menu.
			actions.openMenu($open);

			tick().then(() => {
				if ($selectedValue[0]) {
					return;
				}

				const menuEl = document.getElementById(ids.menu);
				if (!isHTMLElement(menuEl)) {
					return;
				}

				const enabledItems = Array.from(
					menuEl.querySelectorAll(
						`[data-command-item]:not([data-disabled]):not([data-hidden])`,
					),
				).filter((item): item is HTMLElement => isHTMLElement(item));
				console.log({ enabledItems });
				if (!enabledItems.length) {
					return;
				}

				if (e.key === kbd.ARROW_DOWN) {
					activeElement.set(enabledItems[0] ?? null);
				} else if (e.key === kbd.ARROW_UP) {
					activeElement.set(enabledItems.at(-1) ?? null);
				}
			});
		}

		/**
		 * When the menu is open...
		 */
		// Pressing `esc` should close the menu.
		if (e.key === kbd.TAB || e.key === kbd.ESCAPE) {
			actions.closeMenu();
            setTimeout(() => {
                actions.reset();

            }, 250);
			// tick().then(() => {
			// });
			return;
		}
		// Pressing enter with a highlighted item should select it.
		if (e.key === kbd.ENTER) {
			if ($activeElement) {
				actions.selectItem($activeElement);
			}
			actions.closeMenu();
		}

		// Pressing space after navigating when we're in multiple mode should toggle the item, but not close the menu
		if (e.key === kbd.SPACE && hasNavigated) {
			if ($activeElement && options.multiple) {
				e.preventDefault();
				actions.selectItem($activeElement);
				return;
			}
		}

		// Pressing Alt + Up should close the menu.
		if (e.key === kbd.ARROW_UP && e.altKey) {
			actions.closeMenu();
		}

		// Navigation (up, down, etc.) should change the highlighted item.
		if (FIRST_LAST_KEYS.includes(e.key)) {
			e.preventDefault();

			// Get all the menu items.
			const menuElement = document.getElementById(ids.menu);
			if (!isHTMLElement(menuElement)) {
				return;
			}
			const itemElements = getOptions(menuElement);
			if (!itemElements.length) {
				return;
			}
			// Disabled items can't be highlighted. Skip them.
			const candidateNodes = itemElements.filter(
				(opt) => !isElementDisabled(opt) && opt.dataset.hidden === undefined,
			);
			// Get the index of the currently highlighted item.
			const currentIndex = $activeElement
				? candidateNodes.indexOf($activeElement)
				: -1;
			// Find the next menu item to highlight.
			// const $loop = get(loop);
			// const $scrollAlignment = get(scrollAlignment);
			let nextItem: HTMLElement;
			switch (e.key) {
				case kbd.ARROW_DOWN:
					nextItem = candidateNodes[
						Math.min(currentIndex + 1, candidateNodes.length - 1)
					] as HTMLElement;
					break;
				case kbd.ARROW_UP:
					nextItem = candidateNodes[
						Math.max(currentIndex - 1, 0)
					] as HTMLElement;
					break;
				case kbd.PAGE_DOWN:
					nextItem = candidateNodes[
						Math.min(currentIndex + 10, candidateNodes.length - 1)
					] as HTMLElement;
					break;
				case kbd.PAGE_UP:
					nextItem = candidateNodes[
						Math.max(currentIndex - 10, 0)
					] as HTMLElement;
					break;
				case kbd.HOME:
					nextItem = candidateNodes[0] as HTMLElement;
					break;
				case kbd.END:
					nextItem = candidateNodes.at(-1) as HTMLElement;
					break;
				default:
					return;
			}
			// Mark us as having navigated
			hasNavigated = true;
			// Highlight the new item and scroll it into view.
			activeElement.set(nextItem);
			nextItem.scrollIntoView({ block: 'nearest' });
		}
	}

	function handleInput(e: Event) {
		hasNavigated = false;
		if (!inputEl) {
			return;
		}
		// TODO
	}

	let containerEl: HTMLDivElement;
	let borderBoxSize: Array<{ blockSize: number; inlineSize: number }>;

	$: if (borderBoxSize?.[0]?.blockSize) {
		$inputHeight = borderBoxSize?.[0]?.blockSize;
	}
	// onMount(() => {
	// 	if (containerEl) {
	// 		const {  } = containerEl.getBoundingClientRect();
	// 		$inputHeight = containerHeight;
	// 	}
	// });
</script>

<div
	bind:this={containerEl}
	bind:borderBoxSize
	class="flex items-center px-3"
	data-command-input-wrapper
>
	<Search class="mr-2 h-4 w-4 shrink-0 opacity-50" />
	<input
		data-command-input
		aria-activedescendant={$activeElement?.id}
		aria-autocomplete="list"
		aria-controls={ids.menu}
		aria-expanded={$open}
		aria-labelledby={ids.label}
		autocomplete="off"
		class={cn(
			!unstyled &&
				'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
			className,
		)}
		id={ids.input}
		role="combobox"
		type="text"
		{...$$restProps}
		bind:this={inputEl}
		bind:value={$inputValue}
		on:click={handleClick}
		on:keydown={handleKeydown}
		on:input={handleInput}
	/>
</div>
