import type { Action } from 'svelte/action';

export const longpress: Action<HTMLElement, () => void> = (node, cb) => {
    const TIME_MS = 100;
    let timeoutPtr: number;

    function handleMouseDown(e: MouseEvent) {
        console.log("hello")
        window.addEventListener('pointermove', handleMoveBeforeLong);
        timeoutPtr = window.setTimeout(() => {
            console.log("looooong press!");
            window.removeEventListener('pointermove', handleMoveBeforeLong);
            if (cb) cb();
            // node.dispatchEvent(new CustomEvent('long'));
            // TODO - ideally make this not trigger long press again
            // window.setTimeout(() => node.dispatchEvent(e), 0);
        }, TIME_MS);
    }
    function handleMoveBeforeLong(e: MouseEvent) {
        console.log("movebeforetoolong")
        window.clearTimeout(timeoutPtr);
        window.removeEventListener('pointermove', handleMoveBeforeLong);
    }
    function handleMouseUp(e: MouseEvent) {
        window.clearTimeout(timeoutPtr);
        window.removeEventListener('pointermove', handleMoveBeforeLong);
    }
    node.addEventListener('pointerdown', handleMouseDown);
    node.addEventListener('pointerup', handleMouseUp);
    return {
        destroy: () => {
            node.removeEventListener('pointerdown', handleMouseDown);
            node.removeEventListener('pointerup', handleMouseUp);
        }
    }
};
