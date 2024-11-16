export function createVariants<T extends string>(variants: readonly T[]): Record<T, string> {
	return variants.reduce(
		(acc, variant) => {
			acc[variant] = `rt-r-variant-${variant}`;
			return acc;
		},
		{} as Record<T, string>
	);
}
