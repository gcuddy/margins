import { createSizes } from '$lib/props/size.prop';
import { createVariants } from '$lib/props/variant.prop';
import { tv, type VariantProps } from 'tailwind-variants';

export const segmentedControlVariants = tv({
	base: ['rt-SegmentedControlRoot'],
	variants: {
		size: createSizes(3),
		variant: createVariants(['surface', 'classic'])
	}
});

export type SegmentedControlProps = VariantProps<typeof segmentedControlVariants>;
