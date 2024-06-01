const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
type Size = (typeof sizes)[number];

export const createSizeVariant = <TSizes extends Size[]>(sizes: TSizes) =>
	Object.fromEntries(sizes.map((size) => [size, `m-size-${size}`])) as {
		[K in TSizes[number]]: string;
	};
