import { getContext, setContext } from 'svelte';
import { persisted } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';
import { createArticleStore } from './[id]/store';

function createAppearanceOptions() {
	let align = ['left', 'justify'] as const;
	type Alignment = (typeof align)[number];
	let alignment: Alignment = align[0];

	let fonts = ['sans', 'newsreader', 'crimson'] as const;
	type Font = (typeof fonts)[number];
	let font: Font = fonts[0];

	let fontSize = 16;
	let lineHeight = 1.75;

	type Opts = {
		alignment: Alignment;
		font: Font;
		fontSize: number;
		lineHeight: number;
		autoHide: boolean;
		focusMode: boolean;
	};
	const defaultOpts: Opts = {
		alignment,
		font,
		fontSize,
		lineHeight,
		autoHide: true,
		focusMode: false
	};

	const appearance = persisted('appearance', defaultOpts);

    return {
        ...appearance,
        consts: {
            align,
            fonts,
        }
    };
}

const APPEARANCE_NAME = Symbol('appearance');

export function setAppearanceContext() {
    const appearance = createAppearanceOptions()
    setContext(APPEARANCE_NAME, appearance);
    return appearance
}

export function getAppearanceContext() {
    return getContext<ReturnType<typeof setAppearanceContext>>(APPEARANCE_NAME);
}





const ARTICLE_NAME = Symbol('article');
export function setArticleContext() {
    // annotations, progress etc

    const article = createArticleStore();
    setContext(ARTICLE_NAME, article);

    return article;
}

export function getArticleContext() {
    return getContext<ReturnType<typeof setArticleContext>>(ARTICLE_NAME);
}
