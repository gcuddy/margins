import {
	FastAverageColor,
	type FastAverageColorResult,
} from 'fast-average-color';

const averageColor = (
	image: HTMLImageElement,
	cb: (color: FastAverageColorResult) => void,
) => {
	const fac = new FastAverageColor();
	fac
		.getColorAsync(image)
		.then((color) => {
			cb(color);
		})
		.catch((error) => {
			// eslint-disable-next-line no-console
			console.error(error);
		});
	return {
		destroy() {
			fac.destroy();
		},
		update() {
			fac.getColorAsync(image).then((color) => {
				cb(color);
			});
		},
	};
};

export default averageColor;
