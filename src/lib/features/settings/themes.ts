// import Color from "color"

import { objectEntries } from '$lib/helpers';
import { z } from 'zod';

// determine if light or dark

// const isDark = (bg: string) => Color(bg).isDark();

export const darkThemes = ['dark', 'synthwave'];

export const themes = {
	Dark: 'dark',
	Light: 'light',
	'System (ALPHA)': 'system',
	Gray: 'gray',
	'Synthwave (ALPHA)': 'synthwave',
	// Solarized: 'solarized',
	'Flexoki (ALPHA)': 'flexoki',
} as const;
export const allowedThemes = objectEntries(themes).map(([_, v]) => v);
export const allowedThemesRegex = new RegExp(`(${allowedThemes.join('|')})`);
export const themeSchema = z.nativeEnum(themes);

export type Theme = z.infer<typeof themeSchema>;

export const isTheme = (theme: string): theme is Theme => {
	return allowedThemes.includes(theme as Theme);
};

export function updateTheme(theme: Theme) {
	if (theme === 'system') {
		document.documentElement.removeAttribute('data-theme');
	} else {
		document.documentElement.setAttribute('data-theme', theme);
	}
	if (darkThemes.includes(theme)) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
}
