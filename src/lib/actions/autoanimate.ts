import type { AutoAnimateOptions } from "@formkit/auto-animate";
import autoAnimate from "@formkit/auto-animate";
import type { Action } from "svelte/action";

const autoanimate = ((
	node: HTMLElement,
	options: Partial<AutoAnimateOptions> & {
		disabled?: boolean;
	}
) => {
	let animationController = autoAnimate(node, options);
	if (options.disabled) {
		animationController.disable();
	}
	return {
		update(
			options: Partial<AutoAnimateOptions> & {
				disabled?: boolean;
			}
		) {
			if (options.disabled) {
				animationController.disable();
			} else {
				animationController.enable();
			}
		},
		destroy() {
			animationController.destroy && animationController.destroy();
		},
	};
}) satisfies Action;

export default autoanimate;
