export function drag<T extends HTMLElement | SVGElement>(
	node: T,
	{
		cb,
		click,
	}: {
		cb: (event: MouseEvent) => void;
		click?: (event: MouseEvent) => void;
	}
) {
	let dragging = false;

	const mousedown = (event: MouseEvent) => {
		if (event.which !== 1) return;

		event.preventDefault();

		if (click) click(event);
		dragging = true;

		const onmouseup = () => {
			dragging = false;

			window.removeEventListener("mousemove", cb, false);
			window.removeEventListener("mouseup", onmouseup, false);
		};

		window.addEventListener("mousemove", cb, false);
		window.addEventListener("mouseup", onmouseup, false);
	};

	node.addEventListener("mousedown", mousedown, false);

	return {
		destroy() {
			node.removeEventListener("mousedown", mousedown, false);
		},
	};
}
