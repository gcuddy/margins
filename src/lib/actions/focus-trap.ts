import {
	type ActivateOptions,
	createFocusTrap,
	type DeactivateOptions,
	type Options as FocusTrapOptions,
} from 'focus-trap';

export type FocusTrapConfig = FocusTrapOptions & {
	/**
	 * Immediately activate the trap
	 */
	immediate?: boolean;
};

/**
 * Heavily indebted to melt-ui's version, but this version is more suited for svelte syntax as the config is set on the action.
 * @param node
 * @param config
 */
const focusTrap = (node: HTMLElement, config: FocusTrapConfig) => {
	const { immediate, ...restConfig } = config;
	// TODO: is it useful to provide the hasFocused stores that Melt-UI does? Or do we just need the action?
	const trap = createFocusTrap(node, {
		allowOutsideClick: false,
		escapeDeactivates: false,
		returnFocusOnDeactivate: false,
		...restConfig,
	});

	if (immediate === true || immediate === undefined) {
		trap.activate();
	}

	return {
		destroy: () => {
			trap.deactivate();
		},
		update: (params: Partial<FocusTrapConfig>) => {
			trap.updateContainerElements(node);
			if (params.immediate) {
				trap.activate();
			} else if (params.immediate === false) {
				trap.deactivate();
			}
		},
	};
};

export default focusTrap;
