<script  context="module">import { match } from "../../utils/match";
import { RenderStrategy } from "../../utils/Render.svelte";
import { getContext } from "svelte";
export var TreeStates;
(function (TreeStates) {
    TreeStates["Visible"] = "visible";
    TreeStates["Hidden"] = "hidden";
})(TreeStates || (TreeStates = {}));
export const TRANSITION_CONTEXT_NAME = "headlessui-transition-context";
export const NESTING_CONTEXT_NAME = "headlessui-nesting-context";
export function hasTransitionContext() {
    return getContext(TRANSITION_CONTEXT_NAME) !== undefined;
}
export function useTransitionContext() {
    let context = getContext(TRANSITION_CONTEXT_NAME);
    if (context === undefined) {
        throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
    }
    return context;
}
export function useParentNesting() {
    let context = getContext(NESTING_CONTEXT_NAME);
    if (context === undefined) {
        throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
    }
    return context;
}
export function hasChildren(bag) {
    if ("children" in bag)
        return hasChildren(bag.children);
    return bag.filter(({ state }) => state === TreeStates.Visible).length > 0;
}
export function useNesting(done) {
    let transitionableChildren = [];
    function unregister(childId, strategy = RenderStrategy.Hidden) {
        let idx = transitionableChildren.findIndex(({ id }) => id === childId);
        if (idx === -1)
            return;
        let hadChildren = hasChildren(transitionableChildren);
        match(strategy, {
            [RenderStrategy.Unmount]() {
                transitionableChildren.splice(idx, 1);
            },
            [RenderStrategy.Hidden]() {
                transitionableChildren[idx].state = TreeStates.Hidden;
            },
        });
        if (hadChildren && !hasChildren(transitionableChildren)) {
            done?.();
        }
    }
    function register(childId) {
        let child = transitionableChildren.find(({ id }) => id === childId);
        if (!child) {
            transitionableChildren.push({
                id: childId,
                state: TreeStates.Visible,
            });
        }
        else if (child.state !== TreeStates.Visible) {
            child.state = TreeStates.Visible;
        }
        return () => unregister(childId, RenderStrategy.Unmount);
    }
    return {
        children: transitionableChildren,
        register,
        unregister,
    };
}
</script>
