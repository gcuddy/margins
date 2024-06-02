import type * as CSS from 'csstype';

interface Style extends CSS.Properties, CSS.PropertiesHyphen {}

export function styleToString(
	style: Record<string, string | undefined>,
): string {
	return Object.keys(style).reduce((str, key) => {
		const val = style[key as keyof Style];
		if (val === undefined) return str;
		return str + `${key}:${val};`;
	}, '');
}
