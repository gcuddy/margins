import { tv, type VariantProps } from 'tailwind-variants';

export const dataListRoot = tv({
	base: [
		'[overflow-wrap:anywhere] font-default font-normal not-italic tex-start',
		// trim
		'[--data-list-leading-trim-start:calc(var(--default-leading-trim-start)_-_var(--line-height)_/_2)]',
		'[--data-list-leading-trim-end:calc(var(--default-leading-trim-end)_-_var(--line-height)_/_2)]'
	],
	variants: {
		orientation: {
			vertical: ['flex flex-col', 'group/dataListRootV'],
			horizontal: ['group/dataListRootH', 'grid grid-cols-[auto_1fr]']
		},
		size: {
			'1': 'gap-3',
			'2': 'gap-4',
			'3': 'gap-4.5'
		},
		trim: {
			normal: ['[--leading-trim-start:initial]', '[--leading-trim-end:initial]'],
			start: [
				'[--leading-trim-start:var(--data-list-leading-trim-start)]',
				'[--leading-trim-end:initial]'
			],
			end: [
				'[--leading-trim-start:initial]',
				'[--leading-trim-end:var(--data-list-leading-trim-end)]'
			],
			both: [
				'[--leading-trim-start:var(--data-list-leading-trim-start)]',
				'[--leading-trim-end:var(--data-list-leading-trim-end)]'
			]
		}
	},
	defaultVariants: {
		orientation: 'horizontal',
		size: '2'
	}
});

export type DataListProps = VariantProps<typeof dataListRoot>;

export const dataListLabel = tv({
	base: [
		'flex text-gray-11a',
		'high-contrast:text-gray-12 accent-color:text-accent-11a accent-color:high-contrast:text-accent-12',
		// orientation
		'mt-[--data-list-value-margin-top] mb-[--data-list-value-margin-bottom]',
		'group-first/dataListItem:mt-[--data-list-first-item-value-margin-top]',
		'group-last/dataListItem:mb-[--data-list-last-item-value-margin-bottom]',
		// alignment
		"before:content-['']"
	],
	variants: {
		orientation: {
			vertical: ['min-w-0'],
			horizontal: ['min-w-[120px]']
		}
	},
	defaultVariants: {
		orientation: 'horizontal'
	}
});

export type DataListLabelProps = VariantProps<typeof dataListLabel>;

export const dataListValue = tv({
	base: ['flex m-0 min-w-0', "before:content-['']"]
});

export type DataListValueProps = VariantProps<typeof dataListValue>;

export const dataListItem = tv({
	base: [
		'group/dataListItem',
		/* How much the value part can poke outside of the row when in a horizontal data list */
		'[--data-list-value-trim-start:-0.25em]',
		'[--data-list-value-trim-end:-0.25em]',
		'[--data-list-first-item-value-trim-start:0px]',
		'[--data-list-last-item-value-trim-end:0px]',
		'first:mt-[--leading-trim-start] last:mb-[--leading-trim-end]'
	],
	variants: {
		align: {
			baseline: [
				'[--data-list-value-trim-start:-0.25em]',
				'[--data-list-value-trim-end:-0.25em]',
				'[--data-list-first-item-value-trim-start:0px]',
				'[--data-list-last-item-value-trim-end:0px]'
			],
			start: [
				'[--data-list-value-trim-start:0px]',
				'[--data-list-value-trim-end:-0.25em]',
				'[--data-list-first-item-value-trim-start:0px]',
				'[--data-list-last-item-value-trim-end:0px]'
			],
			center: [
				'[--data-list-value-trim-start:-0.25em]',
				'[--data-list-value-trim-end:-0.25em]',
				'[--data-list-first-item-value-trim-start:-0.25em]',
				'[--data-list-last-item-value-trim-end:-0.25em]'
			],
			end: [
				'[--data-list-value-trim-start:-0.25em]',
				'[--data-list-value-trim-end:0px]',
				'[--data-list-first-item-value-trim-start:0px]',
				'[--data-list-last-item-value-trim-end:0px]'
			],
			stretch: [
				'[--data-list-value-trim-start:0px]',
				'[--data-list-value-trim-end:0px]',
				'[--data-list-first-item-value-trim-start:0px]',
				'[--data-list-last-item-value-trim-end:0px]'
			]
		},
		orientation: {
			vertical: [
				'flex flex-col gap-1',
				/* The actual margins that value part gets. These are re-assigned to other vars depending on the orientation */
				'[--data-list-value-margin-top:0px]',
				'[--data-list-value-margin-bottom:0px]',
				'[--data-list-first-item-value-margin-top:0px]',
				'[--data-list-last-item-value-margin-bottom:0px]'
			],
			horizontal: [
				/* Allow the value to poke out of the row when orientation is horizontal */
				'[--data-list-value-margin-top:var(--data-list-value-trim-start)]',
				'[--data-list-value-margin-bottom:var(--data-list-value-trim-end)]',
				'[--data-list-first-item-value-margin-top:var(--data-list-first-item-value-trim-start)]',
				'[--data-list-last-item-value-margin-bottom:var(--data-list-last-item-value-trim-end)]',
				'grid',
				/* Use subgrid so all the label columns remain aligned */
				'grid-cols-[inherit]' /* Fallback */,
				'grid-cols-subgrid gap-[inherit] col-[span_2] items-baseline'
			]
		}
	},
	defaultVariants: {
		orientation: 'horizontal'
	}
});

export type DataListItemProps = VariantProps<typeof dataListItem>;
