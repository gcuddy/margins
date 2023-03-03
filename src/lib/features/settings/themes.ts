export const allowedThemes = ['default', 'dark', 'synthwave'] as const;

export const allowedThemesRegex = new RegExp(`(${allowedThemes.join('|')})`);

import Color from "color"

// determine if light or dark

const isDark = (bg: string) => Color(bg).isDark();

export const darkThemes = ['dark', 'synthwave'];