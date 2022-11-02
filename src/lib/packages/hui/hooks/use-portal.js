export function portal(element, target) {
    if (target) {
        target.append(element);
    }
    return {
        update(newTarget) {
            target = newTarget;
            newTarget.append(element);
        },
        destroy() {
            // Need to detach ourselves--we can't rely on Svelte always detaching
            // us since we moved in the component tree.
            if (target?.contains(element)) {
                target.removeChild(element);
            }
            if (target && target.childNodes.length <= 0) {
                target.parentElement?.removeChild(target);
            }
        },
    };
}
