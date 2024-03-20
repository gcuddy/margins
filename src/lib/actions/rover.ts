type Opts = {
	linkSelector: string;
	idAttr?: string;
	initialId?: string | number;
};

/**
 *
 * @param node Parent element to run roving tabindex on
 * @returns
 */
export default function rover(node: HTMLElement, opts?: Opts) {
	let active: HTMLElement | null = null;
	let active_index = -1;

	const { linkSelector = 'a', idAttr, initialId } = opts || {};
	console.log({ idAttr, initialId });
	let links: HTMLElement[] = Array.from(node.querySelectorAll(linkSelector));

	const setTabIndex = (el: HTMLElement) => {
		// check if el is already active
		if (el.isSameNode(active)) return;
		// make sure el is in links
		if (!links.includes(el)) return;
		links.forEach((link) => {
			link.setAttribute('tabindex', '-1');
		});
		el.setAttribute('tabindex', '0');
		active = el;
		active_index = links.indexOf(el);
		console.log({ active, active_index });
		el.focus();
	};

	const setUpFocus = (e: FocusEvent) => {
		const target = e.target as HTMLElement;
		setTabIndex(target);
	};

	node.addEventListener('focusin', setUpFocus);
	// , {
	//     once: true
	// }

	if (initialId && idAttr) {
		const initial = node.querySelector(`[${idAttr}="${initialId}"]`);
		console.log({ initial });
		if (initial) {
			setTabIndex(initial as HTMLElement);
		}
	}

	// keyboard navigation on window
	const keyboard_nav = (e: KeyboardEvent) => {
		// check if keyboard shortcuts are allowed
		if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;

		// check if focus is in something like a text field
		const activeElement = document.activeElement;
		if (activeElement && activeElement.tagName === 'INPUT') return;
		if (activeElement && activeElement.tagName === 'TEXTAREA') return;

		if (e.key === 'j' || e.key === 'k') {
			console.log({ active, active_index, idAttr });
			if (!active || !document.contains(active)) {
				if (active && idAttr) {
					const active_id = active.getAttribute(idAttr);
					console.log({ active_id });
					if (active_id) {
						const next = node.querySelector(`[${idAttr}="${active_id}"]`);
						if (next) {
							setTabIndex(next as HTMLElement);
							return;
						}
					}
				}
				if (active_index > -1 && links[active_index]) {
					const nextIndex = Math.min(active_index, links.length - 1);
					const next = links[nextIndex];
					if (next) setTabIndex(next);
					return;
				} else if (links[0]) {
					setTabIndex(links[0]);
					return;
				}
			}
			if (!active) return;
			console.log('j or k');
			e.preventDefault();
			const index = links.indexOf(active);
			let nextIndex = Math.min(index + 1, links.length - 1);
			if (e.key === 'k') {
				nextIndex = Math.max(index - 1, 0);
			}
			// if (nextIndex >= links.length) {
			//     nextIndex = 0;
			// }
			// if (nextIndex < 0) {
			//     nextIndex = links.length - 1;
			// }
			const next = links[nextIndex];
			next?.focus();
		}

		// todo: opt for select
	};
	window.addEventListener('keydown', keyboard_nav);

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === 'childList') {
				links = Array.from(node.querySelectorAll(linkSelector));
				links.forEach((link) => {
					const tabindex = link.getAttribute('tabindex');
					if (tabindex === null) {
						link.setAttribute('tabindex', '-1');
					}
				});
			}
		}
	});

	observer.observe(node, {
		childList: true,
		subtree: true,
	});

	return {
		destroy() {
			observer.disconnect();
			node.removeEventListener('focusin', setUpFocus);
			window.removeEventListener('keydown', keyboard_nav);
		},
		update(opts?: Opts) {
			const { idAttr, initialId } = opts || {};
			if (initialId && idAttr) {
				const initial = node.querySelector(`[${idAttr}="${initialId}"]`);
				console.log({ initial });
				if (initial) {
					setTabIndex(initial as HTMLElement);
				}
			}
		},
	};
}
