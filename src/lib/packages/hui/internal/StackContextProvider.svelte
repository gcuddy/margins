<script  context="module">export var StackMessage;
(function (StackMessage) {
    StackMessage[StackMessage["Add"] = 0] = "Add";
    StackMessage[StackMessage["Remove"] = 1] = "Remove";
})(StackMessage || (StackMessage = {}));
const STACK_CONTEXT_NAME = "headlessui-stack-context";
</script>

<script >import { getContext, onDestroy, setContext } from "svelte";
export let onUpdate;
export let element;
function notify(...args) {
    // Notify our layer
    onUpdate?.(...args);
    // Notify the parent
    parentUpdate?.(...args);
}
let parentUpdate = getContext(STACK_CONTEXT_NAME);
setContext(STACK_CONTEXT_NAME, notify);
$: _cleanup = (() => {
    if (_cleanup) {
        _cleanup();
    }
    if (!element)
        return null;
    let savedElement = element;
    notify(StackMessage.Add, savedElement);
    return () => notify(StackMessage.Remove, savedElement);
})();
onDestroy(() => {
    if (_cleanup) {
        _cleanup();
    }
});
</script>

<slot />
