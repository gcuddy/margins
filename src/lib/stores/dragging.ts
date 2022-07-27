import { browser } from '$app/env';
import { writable } from 'svelte/store';

export default writable(false, (set) => {
	let timeOut: NodeJS.Timeout;
	const onDrag = (e: DragEvent) => {
		set(true);
		clearTimeout(timeOut);
		timeOut = setTimeout(() => {
			set(false);
		}, 500);
	};
	const onDragEnd = () => {
		console.log('drag end!');
		set(false);
	};
	if (browser) {
		window.addEventListener('dragover', onDrag);
	}
	return () => {
		if (browser) {
			window.addEventListener('dragover', onDrag);
		}
	};
});
