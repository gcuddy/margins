import type { ExtractUnionType } from '$lib/utils/type-utils';
import { isHTMLInputElement } from '@melt-ui/svelte/internal/helpers';
import type { ComponentType } from 'svelte';
import { Writable, get, writable } from 'svelte/store';
import type { shouldFilterStore } from './store';

type BounceProps =
	| {
			playBounce: true;
			container: Writable<HTMLElement | null>;
	  }
	| {
			playBounce?: false;
			container?: Writable<HTMLElement | null>;
	  };

type CreatePagesProps<T> = {
	initialPages?: T[];
	pages?: T[];
	onPageChange?: (page: T | null) => void;
    /**
     * A store that will be set to true if the current page should be filtered. Can be passed in from the main Command ctx.
     */
    shouldFilterStore?: ReturnType<typeof shouldFilterStore>;
} & BounceProps;

export type PageType = {
	name: string;
	placeholder?: string;
	subPages?: PageType[];
	icon?: ComponentType;
    action?: () => void;
    shouldFilter?: boolean;
    // dialog?: {
    //     type?: "text";
    //     title?: string;
    //     action?: () => void;
    // };
};

// TODO add subpages etc
export function createPages<T extends PageType>(props?: CreatePagesProps<T>) {
	const { initialPages, playBounce, container, onPageChange, pages: pagesData, shouldFilterStore } = props ?? {};

	let pages: T[] = initialPages ?? [];
	let placeholder = writable<string | null>(null);
	const store = writable<T | null>(null);

	function bounce() {
		if (!playBounce) return;
		const $container = get(container);
		if (!$container) return;

		const style = getComputedStyle($container);
		// const transform = style.transform === 'none' ? '' : style.transform;
		// // node.style.transform = `${transform} scale(0.96)`;
		$container.classList.add(`scale-[0.96]`);
		setTimeout(() => {
			if ($container) $container.classList.remove(`scale-[0.96]`);
		}, 100);
	}

	function sync() {
		const page = pages[pages.length - 1] || null;
		store.set(page);
		placeholder.set(page?.placeholder ?? null);
		bounce();
		onPageChange?.(page);
        shouldFilterStore?.set(page?.shouldFilter ?? shouldFilterStore.defaultValue)
	}

	function back() {
		pages = pages.slice(0, -1);
		sync();
	}

	function add(page: T | ExtractUnionType<T, 'name'>) {
		if (typeof page === 'string') {
			const _page = pagesData?.find((p) => p.name === page);
			if (!_page) {
				console.warn(`Page with name ${page} not found, creating one`);
				pages = [...pages, { name: page } as unknown as T];
			} else {
				pages = [...pages, _page];
			}
		} else {
			pages = [...pages, page];
		}
		sync();
	}

	return {
		add,
		back,
		handlers: {
			keydown: (e: KeyboardEvent) => {
				if (!isHTMLInputElement(e.target)) return;
				if (e.key === 'Escape' || (e.key === 'Backspace' && e.target.value === '')) {
					e.preventDefault();
					back();
				}
			}
		},
		helpers: {
			/**
			 * Helper function to create list for mapping over in Svelte. It will automatically return the pagesData you passed into
			 * the store if originally passed in. Either way can set the data by passing in an array of items.
			 * @param items
             * @example
             * {@const filterTypes = createPageItems()}
									{#each filterTypes as { addPage, icon, name }}
										<CommandItem containsPages onSelect={addPage}>
											<svelte:component
												this={icon}
												class="mr-2 h-4 w-4 group-data-[highlighted]:opacity-100 opacity-70"
											/>
											{name}
										</CommandItem>
									{/each}
			 * @returns
			 */
			createItems: (items?: ItemPageOptions<T>[]) => {
                console.log(`createItems`, {pagesData, items})
				if (pagesData && !items) {
					return pagesData.map((page) => ({
						name: page.name,
						page: page.name,
						icon: page.icon,
						addPage: () => {
                            if (page.action) {
                                page.action()
                            } else {
                                add(page)
                            }
                        }
					})) as ItemPageWithFn<T>[];
				} else if (items) {
					const opts = createPageItemList(pages, items);
					return opts.map((page) => ({
						...page,
						addPage: () => {
                            let _page = page as unknown as T;
                            if (_page.action) {
                                _page.action()
                            } else {
                                add(_page)
                            }
                        }
					})) as ItemPageWithFn<T>[];
				}
				return [];
			}
		},
		subscribe: store.subscribe,
		state: {
			placeholder
		}
	};
}

export function assertPagesType<T extends PageType[]>(pages?: T) {
	return pages as unknown as T;
	// return [] as unknown as T[];
}

export type ItemPageOptions<T extends PageType> = {
	name: string;
	page: ExtractUnionType<T, 'name'>;
	icon?: ComponentType;
};

export type ItemPageWithFn<T extends PageType> = ItemPageOptions<T> & {
	addPage: () => void;
};

export function createPageItemList<T extends PageType>(type: T[], pages: ItemPageOptions<T>[]) {
	return pages;
}

/**
 * Creates strongly typed page data to pass into createPages.
 */
export function createPageData<const T extends PageType>(data: T[]) {
	return data;
}

const pages = createPageData([
	{
		name: 'Type',
		placeholder: 'Filter...'
	}
]);
