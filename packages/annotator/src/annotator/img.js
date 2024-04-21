/**
 * Builds selector from an image. It's gonna try its darndest, even using alt text!
 *
 * @param {HTMLImageElement} img
 * @param {Element} root
 */
export function buildSelectorFromImage(img, root) {
	// TODO: cycle thru options (alt, etc) — we can't rely on src as being very useful. alt seems to work though. class would be nice
	const index = [...root.getElementsByTagName(img.tagName)].findIndex((node) =>
		node.isSameNode(img),
	);
	return {
		type: 'XPathSelector',
		value: `//${img.tagName.toLowerCase()}[${index + 1}]`,
	};
	// return {
	// 	xpath: img.tagName.toLowerCase() + `[${index + 1}]`,
	// 	// css: finder(img, {
	// 	// 	root,
	// 	// }),
	// 	alt: img.alt?.length > 2 ? `img[alt="${img.alt}"]` : undefined,
	// 	src: `img[src*="${img.src}"]`,
	// };
}
