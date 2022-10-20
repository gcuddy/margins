import { match } from "./match";
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
export var Focus;
(function (Focus) {
    /** Focus the first non-disabled element */
    Focus[Focus["First"] = 1] = "First";
    /** Focus the previous non-disabled element */
    Focus[Focus["Previous"] = 2] = "Previous";
    /** Focus the next non-disabled element */
    Focus[Focus["Next"] = 4] = "Next";
    /** Focus the last non-disabled element */
    Focus[Focus["Last"] = 8] = "Last";
    /** Wrap tab around */
    Focus[Focus["WrapAround"] = 16] = "WrapAround";
    /** Prevent scrolling the focusable elements into view */
    Focus[Focus["NoScroll"] = 32] = "NoScroll";
})(Focus || (Focus = {}));
export var FocusResult;
(function (FocusResult) {
    FocusResult[FocusResult["Error"] = 0] = "Error";
    FocusResult[FocusResult["Overflow"] = 1] = "Overflow";
    FocusResult[FocusResult["Success"] = 2] = "Success";
    FocusResult[FocusResult["Underflow"] = 3] = "Underflow";
})(FocusResult || (FocusResult = {}));
var Direction;
(function (Direction) {
    Direction[Direction["Previous"] = -1] = "Previous";
    Direction[Direction["Next"] = 1] = "Next";
})(Direction || (Direction = {}));
export function getFocusableElements(container = document.body) {
    if (container == null)
        return [];
    return Array.from(container.querySelectorAll(focusableSelector));
}
export var FocusableMode;
(function (FocusableMode) {
    /** The element itself must be focusable. */
    FocusableMode[FocusableMode["Strict"] = 0] = "Strict";
    /** The element should be inside of a focusable element. */
    FocusableMode[FocusableMode["Loose"] = 1] = "Loose";
})(FocusableMode || (FocusableMode = {}));
export function isFocusableElement(element, mode = FocusableMode.Strict) {
    if (element === document.body)
        return false;
    return match(mode, {
        [FocusableMode.Strict]() {
            return element.matches(focusableSelector);
        },
        [FocusableMode.Loose]() {
            let next = element;
            while (next !== null) {
                if (next.matches(focusableSelector))
                    return true;
                next = next.parentElement;
            }
            return false;
        },
    });
}
export function focusElement(element) {
    element?.focus({ preventScroll: true });
}
export function focusIn(container, focus) {
    let elements = Array.isArray(container)
        ? container
        : getFocusableElements(container);
    let active = document.activeElement;
    let direction = (() => {
        if (focus & (Focus.First | Focus.Next))
            return Direction.Next;
        if (focus & (Focus.Previous | Focus.Last))
            return Direction.Previous;
        throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })();
    let startIndex = (() => {
        if (focus & Focus.First)
            return 0;
        if (focus & Focus.Previous)
            return Math.max(0, elements.indexOf(active)) - 1;
        if (focus & Focus.Next)
            return Math.max(0, elements.indexOf(active)) + 1;
        if (focus & Focus.Last)
            return elements.length - 1;
        throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })();
    let focusOptions = focus & Focus.NoScroll ? { preventScroll: true } : {};
    let offset = 0;
    let total = elements.length;
    let next = undefined;
    do {
        // Guard against infinite loops
        if (offset >= total || offset + total <= 0)
            return FocusResult.Error;
        let nextIdx = startIndex + offset;
        if (focus & Focus.WrapAround) {
            nextIdx = (nextIdx + total) % total;
        }
        else {
            if (nextIdx < 0)
                return FocusResult.Underflow;
            if (nextIdx >= total)
                return FocusResult.Overflow;
        }
        next = elements[nextIdx];
        // Try the focus the next element, might not work if it is "hidden" to the user.
        next?.focus(focusOptions);
        // Try the next one in line
        offset += direction;
    } while (next !== document.activeElement);
    // This is a little weird, but let me try and explain: There are a few scenario's
    // in chrome for example where a focused `<a>` tag does not get the default focus
    // styles and sometimes they do. This highly depends on whether you started by
    // clicking or by using your keyboard. When you programmatically add focus `anchor.focus()`
    // then the active element (document.activeElement) is this anchor, which is expected.
    // However in that case the default focus styles are not applied *unless* you
    // also add this tabindex.
    if (!next.hasAttribute("tabindex"))
        next.setAttribute("tabindex", "0");
    return FocusResult.Success;
}
