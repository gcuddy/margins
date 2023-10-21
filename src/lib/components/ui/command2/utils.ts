import { isHTMLInputElement } from '@melt-ui/svelte/internal/helpers';
import type { ComponentProps, ComponentType, SvelteComponent } from 'svelte';
import { get, type Writable, writable } from 'svelte/store';

import type { ExtractUnionType } from '$lib/utils/type-utils';

import type { shouldFilterStore } from './store';

type BounceProps =
	| {
			container: Writable<HTMLElement | null>;
			playBounce: true;
	  }
	| {
			container?: Writable<HTMLElement | null>;
			playBounce?: false;
	  };

type CreatePagesProps<T> = {
	initialPages?: Array<T>;
	onPageChange?: (page: T | null) => void;
	pages?: Array<T>;
	/**
	 * A store that will be set to true if the current page should be filtered. Can be passed in from the main Command ctx.
	 */
	shouldFilterStore?: Writable<boolean>;
} & BounceProps;

export type PageType = {
	action?: () => void;
	icon?: ComponentType;
	name: string;
	placeholder?: string;
	shouldFilter?: boolean;
	subPages?: Array<PageType>;
	// dialog?: {
	//     type?: "text";
	//     title?: string;
	//     action?: () => void;
	// };
};

export function bounce(container: HTMLElement) {
	// check if  container is in a dialog - if so, we have to bounce that instead
	const dialogEl = container.closest('[data-melt-dialog-content]');
	const el = dialogEl ?? container;
	el.classList.add(`scale-[0.96]`);
	setTimeout(() => {
		if (el) {
			el.classList.remove(`scale-[0.96]`);
		}
	}, 20000);
}

// TODO add subpages etc
export function createPages<T extends PageType>(props?: CreatePagesProps<T>) {
	const {
		container,
		initialPages,
		onPageChange,
		pages: pagesData,
		playBounce,
		shouldFilterStore,
	} = props ?? {};

	let pages: Array<T> = initialPages ?? [];
	const placeholder = writable<string | null>(null);
	const store = writable<T | null>(null);

	function _bounce() {
		if (!playBounce) {
			return;
		}
		const $container = get(container);
		if (!$container) {
			return;
		}

		bounce($container);
	}

	function sync() {
		const page = pages.at(-1) || null;
		store.set(page);
		placeholder.set(page?.placeholder ?? null);
		_bounce();
		onPageChange?.(page);
		shouldFilterStore?.set(
			page?.shouldFilter ?? shouldFilterStore.defaultValue,
		);
	}

	function back() {
		pages = pages.slice(0, -1);
		sync();
	}

	function add(page: T | ExtractUnionType<T, 'name'>) {
		if (typeof page === 'string') {
			const _page = pagesData?.find((p) => p.name === page);
			pages = !_page
				? [...pages, { name: page } as unknown as T]
				: [...pages, _page];
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
				if (!isHTMLInputElement(e.target)) {
					return;
				}
				if (
					e.key === 'Escape' ||
					(e.key === 'Backspace' && e.target.value === '')
				) {
					e.preventDefault();
					back();
				}
			},
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
			createItems: (items?: Array<ItemPageOptions<T>>) => {
				if (pagesData && !items) {
					return pagesData.map((page) => ({
						addPage: () => {
							if (page.action) {
								page.action();
							} else {
								add(page);
							}
						},
						icon: page.icon,
						name: page.name,
						page: page.name,
					})) as Array<ItemPageWithFn<T>>;
				} else if (items) {
					const opts = createPageItemList(pages, items);
					return opts.map((page) => ({
						...page,
						addPage: () => {
							const _page = page as unknown as T;
							if (_page.action) {
								_page.action();
							} else {
								add(_page);
							}
						},
					})) as Array<ItemPageWithFn<T>>;
				}
				return [];
			},
		},
		state: {
			placeholder,
		},
		subscribe: store.subscribe,
	};
}

export function assertPagesType<T extends Array<PageType>>(pages?: T) {
	return pages as unknown as T;
	// return [] as unknown as T[];
}

export type ItemPageOptions<T extends PageType> = {
	icon?: ComponentType;
	name: string;
	page: ExtractUnionType<T, 'name'>;
};

export type ItemPageWithFn<T extends PageType> = ItemPageOptions<T> & {
	addPage: () => void;
};

export function createPageItemList<T extends PageType>(
	type: Array<T>,
	pages: Array<ItemPageOptions<T>>,
) {
	return pages;
}

/**
 * Creates strongly typed page data to pass into createPages.
 */
export function createPageData<const T extends PageType>(data: Array<T>) {
	return data;
}

const pages = createPageData([
	{
		name: 'Type',
		placeholder: 'Filter...',
	},
]);

type CommandDialogState = {
	component: ComponentType | null;
	open: boolean;
	placeholder: string;
	props: Record<string, unknown>;
};

/**
 * Helper function to be used with creating a dynamic commander dialog, when multiple are needed on a page.
 * @example
 * <Command.Dialog bind:open={$commander.open}>
	<Command.Input placeholder={$commander.placeholder} />
	<Command.List>
		<svelte:component this={$commander.component} {...$commander.props} />
	</Command.List>
</Command.Dialog>
 * @returns Commander Dialog Store
 */
export function createCommandDialogStore() {
	const store = writable<CommandDialogState>({
		component: null,
		open: false,
		placeholder: '',
		props: {},
	});

	return {
		...store,

		close: () => {
			store.update((state) => ({
				...state,
				open: false,
			}));
		},

		open: <TComponent extends SvelteComponent>(data: {
			component: ComponentType<TComponent>;
			placeholder?: string;
			props: ComponentProps<TComponent>;
		}) => {
			store.update((state) => ({
				...state,
				...data,
				open: true,
			}));
		},
	};
}
