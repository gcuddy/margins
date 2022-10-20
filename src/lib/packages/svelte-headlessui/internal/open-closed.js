import { getContext, setContext } from "svelte";
export var State;
(function (State) {
    State[State["Open"] = 0] = "Open";
    State[State["Closed"] = 1] = "Closed";
})(State || (State = {}));
const OPEN_CLOSED_CONTEXT_NAME = "headlessui-open-closed-context";
export function hasOpenClosed() {
    return useOpenClosed() !== undefined;
}
export function useOpenClosed() {
    return getContext(OPEN_CLOSED_CONTEXT_NAME);
}
export function useOpenClosedProvider(value) {
    setContext(OPEN_CLOSED_CONTEXT_NAME, value);
}
