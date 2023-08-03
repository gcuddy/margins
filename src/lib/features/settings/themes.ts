// import Color from "color"

// determine if light or dark

// const isDark = (bg: string) => Color(bg).isDark();

export const darkThemes = ['dark', 'synthwave'];

export const themes = [
	{
		theme: 'dark',
		name: 'Dark'
	},
	{
		theme: 'light',
		name: 'Light'
	},
	{
		theme: 'system',
		name: 'System'
	},
	{
		theme: 'synthwave',
		name: 'Synthwave'
	},
	{
		theme: 'solarized-light',
		name: 'Solarized'
	}
] as const;
export const allowedThemes = themes.map(({ theme }) => theme);
export const allowedThemesRegex = new RegExp(`(${allowedThemes.join('|')})`);
