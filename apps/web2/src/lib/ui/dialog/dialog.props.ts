import { tv } from 'tailwind-variants';

export const baseDialogOverlay = tv({
	base: ['fixed inset-0', 'before:fixed before:inset-0 before:bg-overlay']
});

export const baseDialogContent = tv({
	base: [
		'm-auto w-full z-[1] relative box-border overflow-auto rounded-4 p-5 shadow-6',
		'outline-none bg-panel-solid',
		'max-w-2xl'
	]
});
