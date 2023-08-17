import type { ExtractUnionType } from '$lib/utils/type-utils';
import { isHTMLInputElement } from '@melt-ui/svelte/internal/helpers';
import { Writable, get, writable } from 'svelte/store';


type BounceProps = {
    playBounce: true;
	container: Writable<HTMLElement | null>;
} | {
    playBounce?: false;
    container?: Writable<HTMLElement | null>;
}

type CreatePagesProps<T> = {
	initialPages?: T[];
    pages?: T[];
    onPageChange?: (page: T | null) => void;
} & BounceProps;

export type PageType = {
    name: string;
    placeholder?: string;
    subPages?: PageType[];
}


// TODO add subpages etc
export function createPages<T extends PageType>(props?: CreatePagesProps<T>) {
    const { initialPages, playBounce, container, onPageChange, pages: pagesData } = props ?? {};


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
        const page = pages[pages.length - 1] || null
		store.set(page);
        placeholder.set(page?.placeholder ?? null);
        bounce();
        onPageChange?.(page);
	}

	function back() {
		pages = pages.slice(0, -1);
		sync();
	}

	return {
		add: (page: T | ExtractUnionType<T, "name">) => {
            if (typeof page === 'string'){
                const _page = pagesData?.find(p => p.name === page);
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
		},
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
