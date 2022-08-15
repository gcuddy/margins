export function createKeyboardNav<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	TModifier extends Partial<Modifier<any, any>>
>(initOptions?: {}): [ReferenceAction, ContentAction<TModifier>, () => Instance | null] {
	let popperInstance: Instance | null = null;
	let referenceNode: VirtualElement | Element;
	let contentNode: HTMLElement;
	let options: PopperOptions<TModifier> | undefined = initOptions;

	const initPopper = () => {
		if (referenceNode && contentNode) {
			popperInstance = createPopper(referenceNode, contentNode, options);
		}
	};

	const deinitPopper = () => {
		if (popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}
	};

	const referenceAction: ReferenceAction = (node) => {
		referenceNode = node;
		initPopper();
		return {
			destroy() {
				deinitPopper();
			}
		};
	};

	const contentAction: ContentAction<TModifier> = (node, contentOptions?) => {
		contentNode = node;
		options = { ...initOptions, ...contentOptions };
		initPopper();
		return {
			update(newContentOptions: PopperOptions<TModifier>) {
				options = { ...initOptions, ...newContentOptions };
				if (popperInstance && options) {
					popperInstance.setOptions(options);
				}
			},
			destroy() {
				deinitPopper();
			}
		};
	};

	return [referenceAction, contentAction, () => popperInstance];
}
