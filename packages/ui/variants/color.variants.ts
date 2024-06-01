const grayColors = ['gray'] as const;
const accentColors = ['gray', 'gold', 'green'] as const;

const colorVariant = Object.fromEntries(
	accentColors.map((color) => [color, `m-accent-${color}`]),
) as {
	[color in (typeof accentColors)[number]]: string;
};

export { grayColors, accentColors, colorVariant };
