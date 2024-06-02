export const variants = [
	'classic',
	'solid',
	'soft',
	'surface',
	'outline',
	'ghost',
] as const;
type Variant = Readonly<(typeof variants)[number]>;

export const createVariantVariants = <TVariants extends Readonly<Variant[]>>(
	variants: TVariants,
) =>
	Object.fromEntries(
		variants.map((variant) => [variant, `m-variant-${variant}`]),
	) as {
		[K in TVariants[number]]: string;
	};
