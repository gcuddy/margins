import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';
import { persisted } from 'svelte-local-storage-store';

import { type ArticleStore, createArticleStore } from './[id]/store';

const align = ['left', 'justify'] as const;
type Alignment = (typeof align)[number];
const alignment: Alignment = align[0];

const fonts = ['sans', 'newsreader', 'crimson'] as const;
type Font = (typeof fonts)[number];
const font: Font = fonts[0];

const fontSize = 16;
const lineHeight = 1.75;

type AppearanceOpts = {
	alignment: Alignment;
	font: Font;
	fontSize: number;
	lineHeight: number;
	autoHide: boolean;
	focusMode: boolean;
};
const defaultOpts: AppearanceOpts = {
	alignment,
	font,
	fontSize,
	lineHeight,
	autoHide: true,
	focusMode: false,
};

type AppearanceContext = Writable<AppearanceOpts> & {
    consts: {
        align: typeof align;
        fonts: typeof fonts;
    }
}

function createAppearanceOptions(): AppearanceContext {
	const appearance = persisted('appearance', defaultOpts);

	return {
		...appearance,
		consts: {
			align,
			fonts,
		},
	};
}

const APPEARANCE_NAME = Symbol('appearance');

export function setAppearanceContext(): AppearanceContext {
	const appearance = createAppearanceOptions();
	setContext(APPEARANCE_NAME, appearance);
	return appearance;
}

export function getAppearanceContext(): AppearanceContext {
	return getContext<AppearanceContext>(APPEARANCE_NAME);
}

const ARTICLE_NAME = Symbol('article');
export function setArticleContext(): ArticleStore {
	// TODO: annotations, progress etc
	const article = createArticleStore();
	setContext(ARTICLE_NAME, article);
	return article;
}

export function getArticleContext(): ArticleStore {
	return getContext<ReturnType<typeof setArticleContext>>(ARTICLE_NAME);
}

type EntryContext = {
	rightSidebar: Writable<boolean>;
	rightSidebarWidth: Writable<number>;
	navWidth: Writable<number>;
    scrollingDown: Writable<boolean>;
};

const ENTRY_CONTEXT_NAME = Symbol('entry');

export function setEntryContext(): EntryContext {
	const rightSidebar = persisted('rightSidebar', true);
	const rightSidebarWidth = persisted('rightSidebarWidth', 360);
	const navWidth = writable(0);
    const scrollingDown = writable(false);

	const state = {
		rightSidebar,
		rightSidebarWidth,
		navWidth,
        scrollingDown
	};

	setContext(ENTRY_CONTEXT_NAME, state);

	return state;
}

export function getEntryContext(): EntryContext {
	return getContext<EntryContext>(ENTRY_CONTEXT_NAME);
}
