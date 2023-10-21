import { tick } from 'svelte';

export function make_portal<TParams = undefined>(selector: ((obj: TParams) => string) | string) {

	const action = (
		el: HTMLElement,
        ...args: (TParams extends undefined ? [undefined?] : [TParams])
	) => {
		let targetEl: HTMLElement | null = null;

        const params = args[0];
        if (typeof selector !== 'string' && !params) {
            throw new Error('Selector is a function, but no params were provided');
        }

		async function update() {
            let _selector = typeof selector === 'string' ? selector : selector(params!);
			targetEl = document.querySelector(_selector) as HTMLElement;
            console.log({_selector, targetEl})
			if (!targetEl) {
				// Try with a tick first
				await tick();
				targetEl = document.querySelector(_selector) as HTMLElement;
			}
			if (!targetEl) {
				throw new Error('Target element not found');
			}

			targetEl.appendChild(el);
			el.hidden = false;
		}
		function destroy() {
			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}
		}

		update();

		return {
			update,
			destroy
		};
	};
	return action;
}
