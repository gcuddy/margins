import type { AccentColor } from '$lib/props/color.prop';
import { getContext, setContext } from 'svelte';

const id: unique symbol = Symbol('theme');

type ThemeContextValue = {
	hasBackground: boolean;
	accentColor: AccentColor;
};

const themeContextDefaults: ThemeContextValue = {
	hasBackground: true,
	accentColor: 'orange'
};

export class ThemeContext implements ThemeContextValue {
	hasBackground = $state() as boolean;
	accentColor = $state() as AccentColor;

	constructor({ hasBackground, accentColor }: Partial<ThemeContextValue>) {
		this.hasBackground = hasBackground ?? themeContextDefaults.hasBackground;
		this.accentColor = accentColor ?? themeContextDefaults.accentColor;
		setContext(id, this);
	}

	static getContext() {
		return getContext<ThemeContext | undefined>(id);
	}

	static getContextOrThrow() {
		const ctx = this.getContext();
		if (!ctx) {
			throw new Error('Theme context not found');
		}
		return ctx;
	}
}
