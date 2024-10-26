import { tv } from 'tailwind-variants';

export const baseDialogOverlay = tv({
	base: [
		'fixed inset-0',
		'before:fixed before:inset-0 before:bg-overlay',
		// animation
		// no-op animation to prevent flicker
		'data-[state=closed]:motion-opacity-out-100 data-[state=closed]:motion-duration-[160ms]',
		'data-[state=open]:before:motion-preset-fade data-[state=open]:before:motion-duration-200 data-[state=closed]:before:motion-duration-[160ms] data-[state=closed]:before:motion-opacity-out-0'
	]
});

export const baseDialogContent = tv({
	base: [
		'm-auto w-full z-[1] relative box-border overflow-auto rounded-4 p-5 shadow-6',
		'outline-none bg-panel-solid',
		'max-w-2xl',
		// animation
		'data-[state=open]:motion-scale-in-[0.97] data-[state=open]:motion-opacity-in-[50%] data-[state=open]:motion-duration-200 data-[state=closed]:motion-scale-out-[0.97] data-[state=closed]:motion-opacity-out-0 data-[state=closed]:motion-duration-100'
	]
});
