import { styleToString } from '@margins/lib';

const widthVariants = {
	width: {
		true: 'w-[--width]',
	},
	minWidth: {
		true: 'min-w-[--min-width]',
	},
	maxWidth: {
		true: 'max-w-[--max-width]',
	},
} as const satisfies Record<keyof WidthProps, Record<string, string>>;

type WidthProps = {
	width?: string;
	minWidth?: string;
	maxWidth?: string;
};

const applyWidth = (widthProps: WidthProps) =>
	styleToString({
		'--width': widthProps.width,
		'--max-width': widthProps.maxWidth,
		'--min-width': widthProps.minWidth,
	});

export { applyWidth, widthVariants, WidthProps };
