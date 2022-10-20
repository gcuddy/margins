import { tick } from "svelte";
import { fireEvent } from "@testing-library/svelte";
export let Keys = {
    Space: { key: " ", keyCode: 32, charCode: 32 },
    Enter: { key: "Enter", keyCode: 13, charCode: 13 },
    Escape: { key: "Escape", keyCode: 27, charCode: 27 },
    Backspace: { key: "Backspace", keyCode: 8 },
    ArrowLeft: { key: "ArrowLeft", keyCode: 37 },
    ArrowUp: { key: "ArrowUp", keyCode: 38 },
    ArrowRight: { key: "ArrowRight", keyCode: 39 },
    ArrowDown: { key: "ArrowDown", keyCode: 40 },
    Home: { key: "Home", keyCode: 36 },
    End: { key: "End", keyCode: 35 },
    PageUp: { key: "PageUp", keyCode: 33 },
    PageDown: { key: "PageDown", keyCode: 34 },
    Tab: { key: "Tab", keyCode: 9, charCode: 9 },
};
export function shift(event) {
    return { ...event, shiftKey: true };
}
export function word(input) {
    return input.split("").map((key) => ({ key }));
}
let Default = Symbol();
let Ignore = Symbol();
let cancellations = {
    [Default]: {
        keydown: new Set(["keypress"]),
        keypress: new Set([]),
        keyup: new Set([]),
    },
    [Keys.Enter.key]: {
        keydown: new Set(["keypress", "click"]),
        keypress: new Set(["click"]),
        keyup: new Set([]),
    },
    [Keys.Space.key]: {
        keydown: new Set(["keypress", "click"]),
        keypress: new Set([]),
        keyup: new Set(["click"]),
    },
    [Keys.Tab.key]: {
        keydown: new Set(["keypress", "blur", "focus"]),
        keypress: new Set([]),
        keyup: new Set([]),
    },
};
let order = {
    [Default]: [
        async function keydown(element, event) {
            return await fireEvent.keyDown(element, event);
        },
        async function keypress(element, event) {
            return await fireEvent.keyPress(element, event);
        },
        async function keyup(element, event) {
            return await fireEvent.keyUp(element, event);
        },
    ],
    [Keys.Enter.key]: [
        async function keydown(element, event) {
            return await fireEvent.keyDown(element, event);
        },
        async function keypress(element, event) {
            return await fireEvent.keyPress(element, event);
        },
        async function click(element, event) {
            if (element instanceof HTMLButtonElement)
                return await fireEvent.click(element, event);
            return Ignore;
        },
        async function keyup(element, event) {
            return await fireEvent.keyUp(element, event);
        },
    ],
    [Keys.Space.key]: [
        async function keydown(element, event) {
            return await fireEvent.keyDown(element, event);
        },
        async function keypress(element, event) {
            return await fireEvent.keyPress(element, event);
        },
        async function keyup(element, event) {
            return await fireEvent.keyUp(element, event);
        },
        async function click(element, event) {
            if (element instanceof HTMLButtonElement)
                return await fireEvent.click(element, event);
            return Ignore;
        },
    ],
    [Keys.Tab.key]: [
        async function keydown(element, event) {
            return await fireEvent.keyDown(element, event);
        },
        async function blurAndfocus(_element, event) {
            return focusNext(event);
        },
        async function keyup(element, event) {
            return await fireEvent.keyUp(element, event);
        },
    ],
};
export async function type(events, element = document.activeElement) {
    jest.useFakeTimers();
    try {
        if (element === null)
            return expect(element).not.toBe(null);
        for (let event of events) {
            let skip = new Set();
            let actions = order[event.key] ?? order[Default];
            for (let action of actions) {
                let checks = action.name.split("And");
                if (checks.some((check) => skip.has(check)))
                    continue;
                let result = await action(element, {
                    type: action.name,
                    charCode: event.key?.length === 1 ? event.key?.charCodeAt(0) : undefined,
                    ...event,
                });
                if (result === Ignore)
                    continue;
                if (result instanceof Element) {
                    element = result;
                }
                let cancelled = !result;
                if (cancelled) {
                    let skippablesForKey = cancellations[event.key] ?? cancellations[Default];
                    let skippables = skippablesForKey?.[action.name] ?? new Set();
                    for (let skippable of skippables)
                        skip.add(skippable);
                }
            }
        }
        // We don't want to actually wait in our tests, so let's advance
        jest.runAllTimers();
        await tick();
    }
    catch (err) {
        Error.captureStackTrace(err, type);
        throw err;
    }
    finally {
        jest.useRealTimers();
    }
}
export async function press(event, element = document.activeElement) {
    return type([event], element);
}
export var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Right"] = 2] = "Right";
})(MouseButton || (MouseButton = {}));
export async function click(element, button = MouseButton.Left) {
    try {
        if (element === null)
            return expect(element).not.toBe(null);
        let options = { button };
        if (button === MouseButton.Left) {
            // Cancel in pointerDown cancels mouseDown, mouseUp
            let cancelled = !(await fireEvent.pointerDown(element, options));
            if (!cancelled) {
                await fireEvent.mouseDown(element, options);
            }
            // Ensure to trigger a `focus` event if the element is focusable, or within a focusable element
            let next = element;
            while (next !== null) {
                if (next.matches(focusableSelector)) {
                    next.focus();
                    break;
                }
                next = next.parentElement;
            }
            await fireEvent.pointerUp(element, options);
            if (!cancelled) {
                await fireEvent.mouseUp(element, options);
            }
            await fireEvent.click(element, options);
        }
        else if (button === MouseButton.Right) {
            // Cancel in pointerDown cancels mouseDown, mouseUp
            let cancelled = !(await fireEvent.pointerDown(element, options));
            if (!cancelled) {
                await fireEvent.mouseDown(element, options);
            }
            // Only in Firefox:
            await fireEvent.pointerUp(element, options);
            if (!cancelled) {
                await fireEvent.mouseUp(element, options);
            }
        }
    }
    catch (err) {
        Error.captureStackTrace(err, click);
        throw err;
    }
}
export async function focus(element) {
    try {
        if (element === null)
            return expect(element).not.toBe(null);
        await fireEvent.focus(element);
        await tick();
    }
    catch (err) {
        Error.captureStackTrace(err, focus);
        throw err;
    }
}
export async function mouseEnter(element) {
    try {
        if (element === null)
            return expect(element).not.toBe(null);
        await fireEvent.pointerOver(element);
        await fireEvent.pointerEnter(element);
        await fireEvent.mouseOver(element);
        await tick();
    }
    catch (err) {
        Error.captureStackTrace(err, mouseEnter);
        throw err;
    }
}
export async function mouseMove(element) {
    try {
        if (element === null)
            return expect(element).not.toBe(null);
        await fireEvent.pointerMove(element);
        await fireEvent.mouseMove(element);
        await tick();
    }
    catch (err) {
        Error.captureStackTrace(err, mouseMove);
        throw err;
    }
}
export async function mouseLeave(element) {
    try {
        if (element === null)
            return expect(element).not.toBe(null);
        await fireEvent.pointerOut(element);
        await fireEvent.pointerLeave(element);
        await fireEvent.mouseOut(element);
        await fireEvent.mouseLeave(element);
        await tick();
    }
    catch (err) {
        Error.captureStackTrace(err, mouseLeave);
        throw err;
    }
}
// ---
function focusNext(event) {
    let direction = event.shiftKey ? -1 : +1;
    let focusableElements = getFocusableElements();
    let total = focusableElements.length;
    function innerFocusNext(offset = 0) {
        let currentIdx = focusableElements.indexOf(document.activeElement);
        let next = focusableElements[(currentIdx + total + direction + offset) % total];
        if (next)
            next?.focus({ preventScroll: true });
        if (next !== document.activeElement)
            return innerFocusNext(offset + direction);
        return next;
    }
    return innerFocusNext();
}
// Credit:
//  - https://stackoverflow.com/a/30753870
let focusableSelector = [
    "[contentEditable=true]",
    "[tabindex]",
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "iframe",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
]
    .map("production" === "test"
    ? // TODO: Remove this once JSDOM fixes the issue where an element that is
        // "hidden" can be the document.activeElement, because this is not possible
        // in real browsers.
        (selector) => `${selector}:not([tabindex='-1']):not([style*='display: none'])`
    : (selector) => `${selector}:not([tabindex='-1'])`)
    .join(",");
function getFocusableElements(container = document.body) {
    if (!container)
        return [];
    return Array.from(container.querySelectorAll(focusableSelector));
}
