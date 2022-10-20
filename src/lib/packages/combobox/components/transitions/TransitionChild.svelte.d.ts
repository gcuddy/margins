/// <reference types="svelte2tsx/svelte-jsx" />
import { SvelteComponentTyped } from "svelte";
export declare type TTransitionProps = {
    enter?: string;
    /** Classes to add to the transitioning element before the enter phase starts */
    enterFrom?: string;
    /** Classes to add to the transitioning element immediately after the enter phase starts */
    enterTo?: string;
    /**
     * Classes to add to the transitioning element once the transition is done.
     * These classes will persist after that until the leave phase
     */
    entered?: string;
    /** Classes to add to the transitioning element during the entire leave phase */
    leave?: string;
    /** Classes to add to the transitioning element before the leave phase starts */
    leaveFrom?: string;
    /** Classes to add to the transitioning element immediately after the leave phase starts */
    leaveTo?: string;
    /** Whether the element should be unmounted, instead of just hidden, based on the open/closed state */
    unmount?: boolean;
    /**
     * A list of actions to apply to the component's HTML element.
     *
     * Each action must take the form `[action]` or `[action, options]`:
     *
     * use={[[action1], [action2, action2Options], [action3]]}
     */
    use?: HTMLActionArray;
    /** The class attribute for this component. It will always be present. */
    class?: string;
    /** The style attribute for this component. It will always be present. */
    style?: string;
    /** The element this component should render as */
    as?: SupportedAs;
};
import type { SupportedAs } from "../../internal/elements";
import type { HTMLActionArray } from "../../hooks/use-actions";
declare const __propDef: {
    props: {
        enter?: string | undefined;
        /** Classes to add to the transitioning element before the enter phase starts */
        enterFrom?: string | undefined;
        /** Classes to add to the transitioning element immediately after the enter phase starts */
        enterTo?: string | undefined;
        /**
         * Classes to add to the transitioning element once the transition is done.
         * These classes will persist after that until the leave phase
         */
        entered?: string | undefined;
        /** Classes to add to the transitioning element during the entire leave phase */
        leave?: string | undefined;
        /** Classes to add to the transitioning element before the leave phase starts */
        leaveFrom?: string | undefined;
        /** Classes to add to the transitioning element immediately after the leave phase starts */
        leaveTo?: string | undefined;
        /** Whether the element should be unmounted, instead of just hidden, based on the open/closed state */
        unmount?: boolean | undefined;
        /**
         * A list of actions to apply to the component's HTML element.
         *
         * Each action must take the form `[action]` or `[action, options]`:
         *
         * use={[[action1], [action2, action2Options], [action3]]}
         */
        use?: HTMLActionArray | undefined;
        /** The class attribute for this component. It will always be present. */
        class?: string | undefined;
        /** The style attribute for this component. It will always be present. */
        style?: string | undefined;
        /** The element this component should render as */
        as?: SupportedAs | undefined;
        'aria-hidden'?: boolean | "true" | "false" | null | undefined;
        cite?: string | null | undefined;
        data?: string | null | undefined;
        dir?: string | null | undefined;
        form?: string | null | undefined;
        label?: string | null | undefined;
        slot?: string | null | undefined;
        span?: number | null | undefined;
        summary?: string | null | undefined;
        title?: string | null | undefined;
        pattern?: string | null | undefined;
        tabindex?: number | null | undefined;
        name?: string | null | undefined;
        id?: string | null | undefined;
        capture?: boolean | "environment" | "user" | null | undefined;
        dataset?: object | null | undefined;
        accept?: string | null | undefined;
        acceptcharset?: string | null | undefined;
        accesskey?: string | null | undefined;
        action?: string | null | undefined;
        allow?: string | null | undefined;
        allowfullscreen?: boolean | null | undefined;
        allowtransparency?: boolean | null | undefined;
        allowpaymentrequest?: boolean | null | undefined;
        alt?: string | null | undefined;
        async?: boolean | null | undefined;
        autocomplete?: string | null | undefined;
        autofocus?: boolean | null | undefined;
        autoplay?: boolean | null | undefined;
        cellpadding?: string | number | null | undefined;
        cellspacing?: string | number | null | undefined;
        charset?: string | null | undefined;
        challenge?: string | null | undefined;
        checked?: boolean | null | undefined;
        classid?: string | null | undefined;
        cols?: number | null | undefined;
        colspan?: number | null | undefined;
        content?: string | null | undefined;
        contenteditable?: boolean | "true" | "false" | null | undefined;
        innerHTML?: string | null | undefined;
        textContent?: string | null | undefined;
        contextmenu?: string | null | undefined;
        controls?: boolean | null | undefined;
        coords?: string | null | undefined;
        crossorigin?: string | null | undefined;
        currenttime?: number | null | undefined;
        decoding?: "async" | "sync" | "auto" | null | undefined;
        datetime?: string | null | undefined;
        default?: boolean | null | undefined;
        defaultmuted?: boolean | null | undefined;
        defaultplaybackrate?: number | null | undefined;
        defer?: boolean | null | undefined;
        dirname?: string | null | undefined;
        disabled?: boolean | null | undefined;
        download?: any;
        draggable?: boolean | "true" | "false" | null | undefined;
        enctype?: string | null | undefined;
        enterkeyhint?: "search" | "enter" | "done" | "go" | "next" | "previous" | "send" | null | undefined;
        for?: string | null | undefined;
        formaction?: string | null | undefined;
        formenctype?: string | null | undefined;
        formmethod?: string | null | undefined;
        formnovalidate?: boolean | null | undefined;
        formtarget?: string | null | undefined;
        frameborder?: string | number | null | undefined;
        headers?: string | null | undefined;
        height?: string | number | null | undefined;
        hidden?: boolean | null | undefined;
        high?: number | null | undefined;
        href?: string | null | undefined;
        hreflang?: string | null | undefined;
        htmlfor?: string | null | undefined;
        httpequiv?: string | null | undefined;
        inputmode?: string | null | undefined;
        integrity?: string | null | undefined;
        is?: string | null | undefined;
        ismap?: boolean | null | undefined;
        keyparams?: string | null | undefined;
        keytype?: string | null | undefined;
        kind?: string | null | undefined;
        lang?: string | null | undefined;
        list?: string | null | undefined;
        loading?: string | null | undefined;
        loop?: boolean | null | undefined;
        low?: number | null | undefined;
        manifest?: string | null | undefined;
        marginheight?: number | null | undefined;
        marginwidth?: number | null | undefined;
        max?: string | number | null | undefined;
        maxlength?: number | null | undefined;
        media?: string | null | undefined;
        mediagroup?: string | null | undefined;
        method?: string | null | undefined;
        min?: string | number | null | undefined;
        minlength?: number | null | undefined;
        multiple?: boolean | null | undefined;
        muted?: boolean | null | undefined;
        nonce?: string | null | undefined;
        novalidate?: boolean | null | undefined;
        open?: boolean | null | undefined;
        optimum?: number | null | undefined;
        part?: string | null | undefined;
        placeholder?: string | null | undefined;
        playsinline?: boolean | null | undefined;
        ping?: string | null | undefined;
        poster?: string | null | undefined;
        preload?: string | null | undefined;
        radiogroup?: string | null | undefined;
        readonly?: boolean | null | undefined;
        referrerpolicy?: string | null | undefined;
        rel?: string | null | undefined;
        required?: boolean | null | undefined;
        reversed?: boolean | null | undefined;
        role?: string | null | undefined;
        rows?: number | null | undefined;
        rowspan?: number | null | undefined;
        sandbox?: string | null | undefined;
        scope?: string | null | undefined;
        scoped?: boolean | null | undefined;
        scrolling?: string | null | undefined;
        seamless?: boolean | null | undefined;
        selected?: boolean | null | undefined;
        shape?: string | null | undefined;
        size?: number | null | undefined;
        sizes?: string | null | undefined;
        spellcheck?: boolean | "true" | "false" | null | undefined;
        src?: string | null | undefined;
        srcdoc?: string | null | undefined;
        srclang?: string | null | undefined;
        srcset?: string | null | undefined;
        start?: number | null | undefined;
        step?: string | number | null | undefined;
        target?: string | null | undefined;
        translate?: "" | "yes" | "no" | null | undefined;
        type?: string | null | undefined;
        usemap?: string | null | undefined;
        value?: any;
        volume?: number | null | undefined;
        width?: string | number | null | undefined;
        wmode?: string | null | undefined;
        wrap?: string | null | undefined;
        about?: string | null | undefined;
        datatype?: string | null | undefined;
        inlist?: any;
        prefix?: string | null | undefined;
        property?: string | null | undefined;
        resource?: string | null | undefined;
        typeof?: string | null | undefined;
        vocab?: string | null | undefined;
        autocapitalize?: string | null | undefined;
        autocorrect?: string | null | undefined;
        autosave?: string | null | undefined;
        color?: string | null | undefined;
        controlslist?: "nodownload" | "nofullscreen" | "noplaybackrate" | "noremoteplayback" | undefined;
        itemprop?: string | null | undefined;
        itemscope?: boolean | null | undefined;
        itemtype?: string | null | undefined;
        itemid?: string | null | undefined;
        itemref?: string | null | undefined;
        results?: number | null | undefined;
        security?: string | null | undefined;
        unselectable?: boolean | null | undefined;
        'aria-activedescendant'?: string | null | undefined;
        'aria-atomic'?: boolean | "true" | "false" | null | undefined;
        'aria-autocomplete'?: "list" | "none" | "inline" | "both" | null | undefined;
        'aria-busy'?: boolean | "true" | "false" | null | undefined;
        'aria-checked'?: boolean | "true" | "false" | "mixed" | null | undefined;
        'aria-colcount'?: number | null | undefined;
        'aria-colindex'?: number | null | undefined;
        'aria-colspan'?: number | null | undefined;
        'aria-controls'?: string | null | undefined;
        'aria-current'?: boolean | "true" | "time" | "step" | "false" | "page" | "location" | "date" | null | undefined;
        'aria-describedby'?: string | null | undefined;
        'aria-details'?: string | null | undefined;
        'aria-disabled'?: boolean | "true" | "false" | null | undefined;
        'aria-dropeffect'?: "link" | "none" | "copy" | "execute" | "move" | "popup" | null | undefined;
        'aria-errormessage'?: string | null | undefined;
        'aria-expanded'?: boolean | "true" | "false" | null | undefined;
        'aria-flowto'?: string | null | undefined;
        'aria-grabbed'?: boolean | "true" | "false" | null | undefined;
        'aria-haspopup'?: boolean | "true" | "dialog" | "menu" | "false" | "listbox" | "tree" | "grid" | null | undefined;
        'aria-invalid'?: boolean | "true" | "false" | "grammar" | "spelling" | null | undefined;
        'aria-keyshortcuts'?: string | null | undefined;
        'aria-label'?: string | null | undefined;
        'aria-labelledby'?: string | null | undefined;
        'aria-level'?: number | null | undefined;
        'aria-live'?: "off" | "assertive" | "polite" | null | undefined;
        'aria-modal'?: boolean | "true" | "false" | null | undefined;
        'aria-multiline'?: boolean | "true" | "false" | null | undefined;
        'aria-multiselectable'?: boolean | "true" | "false" | null | undefined;
        'aria-orientation'?: "vertical" | "horizontal" | null | undefined;
        'aria-owns'?: string | null | undefined;
        'aria-placeholder'?: string | null | undefined;
        'aria-posinset'?: number | null | undefined;
        'aria-pressed'?: boolean | "true" | "false" | "mixed" | null | undefined;
        'aria-readonly'?: boolean | "true" | "false" | null | undefined;
        'aria-relevant'?: "text" | "additions" | "additions removals" | "additions text" | "all" | "removals" | "removals additions" | "removals text" | "text additions" | "text removals" | null | undefined;
        'aria-required'?: boolean | "true" | "false" | null | undefined;
        'aria-roledescription'?: string | null | undefined;
        'aria-rowcount'?: number | null | undefined;
        'aria-rowindex'?: number | null | undefined;
        'aria-rowspan'?: number | null | undefined;
        'aria-selected'?: boolean | "true" | "false" | null | undefined;
        'aria-setsize'?: number | null | undefined;
        'aria-sort'?: "none" | "ascending" | "descending" | "other" | null | undefined;
        'aria-valuemax'?: number | null | undefined;
        'aria-valuemin'?: number | null | undefined;
        'aria-valuenow'?: number | null | undefined;
        'aria-valuetext'?: string | null | undefined;
        oncopy?: svelte.JSX.ClipboardEventHandler<HTMLDivElement> | null | undefined;
        oncut?: svelte.JSX.ClipboardEventHandler<HTMLDivElement> | null | undefined;
        onpaste?: svelte.JSX.ClipboardEventHandler<HTMLDivElement> | null | undefined;
        oncompositionend?: svelte.JSX.CompositionEventHandler<HTMLDivElement> | null | undefined;
        oncompositionstart?: svelte.JSX.CompositionEventHandler<HTMLDivElement> | null | undefined;
        oncompositionupdate?: svelte.JSX.CompositionEventHandler<HTMLDivElement> | null | undefined;
        onfocus?: svelte.JSX.FocusEventHandler<HTMLDivElement> | null | undefined;
        onfocusin?: svelte.JSX.FocusEventHandler<HTMLDivElement> | null | undefined;
        onfocusout?: svelte.JSX.FocusEventHandler<HTMLDivElement> | null | undefined;
        onblur?: svelte.JSX.FocusEventHandler<HTMLDivElement> | null | undefined;
        onchange?: svelte.JSX.FormEventHandler<HTMLDivElement> | null | undefined;
        oninput?: svelte.JSX.FormEventHandler<HTMLDivElement> | null | undefined;
        onreset?: svelte.JSX.FormEventHandler<HTMLDivElement> | null | undefined;
        onsubmit?: svelte.JSX.EventHandler<SubmitEvent, HTMLDivElement> | null | undefined;
        oninvalid?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onbeforeinput?: svelte.JSX.EventHandler<InputEvent, HTMLDivElement> | null | undefined;
        onload?: svelte.JSX.EventHandler<Event, HTMLElement> | null | undefined;
        onerror?: svelte.JSX.EventHandler<Event, HTMLElement> | null | undefined;
        ontoggle?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onkeydown?: svelte.JSX.KeyboardEventHandler<HTMLDivElement> | null | undefined;
        onkeypress?: svelte.JSX.KeyboardEventHandler<HTMLDivElement> | null | undefined;
        onkeyup?: svelte.JSX.KeyboardEventHandler<HTMLDivElement> | null | undefined;
        onabort?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        oncanplay?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        oncanplaythrough?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        oncuechange?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        ondurationchange?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onemptied?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onencrypted?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onended?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onloadeddata?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onloadedmetadata?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onloadstart?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onpause?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onplay?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onplaying?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onprogress?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onratechange?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onseeked?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onseeking?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onstalled?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onsuspend?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        ontimeupdate?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onvolumechange?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onwaiting?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onauxclick?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        onclick?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        oncontextmenu?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        ondblclick?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        ondrag?: svelte.JSX.DragEventHandler<HTMLDivElement> | null | undefined;
        ondragend?: svelte.JSX.DragEventHandler<HTMLDivElement> | null | undefined;
        ondragenter?: svelte.JSX.DragEventHandler<HTMLDivElement> | null | undefined;
        ondragexit?: svelte.JSX.DragEventHandler<HTMLDivElement> | null | undefined;
        ondragleave?: svelte.JSX.DragEventHandler<HTMLDivElement> | null | undefined;
        ondragover?: svelte.JSX.DragEventHandler<HTMLDivElement> | null | undefined;
        ondragstart?: svelte.JSX.DragEventHandler<HTMLDivElement> | null | undefined;
        ondrop?: svelte.JSX.DragEventHandler<HTMLDivElement> | null | undefined;
        onmousedown?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        onmouseenter?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        onmouseleave?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        onmousemove?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        onmouseout?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        onmouseover?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        onmouseup?: svelte.JSX.MouseEventHandler<HTMLDivElement> | null | undefined;
        onselect?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onselectionchange?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onselectstart?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        ontouchcancel?: svelte.JSX.TouchEventHandler<HTMLDivElement> | null | undefined;
        ontouchend?: svelte.JSX.TouchEventHandler<HTMLDivElement> | null | undefined;
        ontouchmove?: svelte.JSX.TouchEventHandler<HTMLDivElement> | null | undefined;
        ontouchstart?: svelte.JSX.TouchEventHandler<HTMLDivElement> | null | undefined;
        ongotpointercapture?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onpointercancel?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onpointerdown?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onpointerenter?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onpointerleave?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onpointermove?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onpointerout?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onpointerover?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onpointerup?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onlostpointercapture?: svelte.JSX.PointerEventHandler<HTMLDivElement> | null | undefined;
        onscroll?: svelte.JSX.UIEventHandler<HTMLDivElement> | null | undefined;
        onresize?: svelte.JSX.UIEventHandler<HTMLDivElement> | null | undefined;
        onwheel?: svelte.JSX.WheelEventHandler<HTMLDivElement> | null | undefined;
        onanimationstart?: svelte.JSX.AnimationEventHandler<HTMLDivElement> | null | undefined;
        onanimationend?: svelte.JSX.AnimationEventHandler<HTMLDivElement> | null | undefined;
        onanimationiteration?: svelte.JSX.AnimationEventHandler<HTMLDivElement> | null | undefined;
        ontransitionstart?: svelte.JSX.TransitionEventHandler<HTMLDivElement> | null | undefined;
        ontransitionrun?: svelte.JSX.TransitionEventHandler<HTMLDivElement> | null | undefined;
        ontransitionend?: svelte.JSX.TransitionEventHandler<HTMLDivElement> | null | undefined;
        ontransitioncancel?: svelte.JSX.TransitionEventHandler<HTMLDivElement> | null | undefined;
        onoutrostart?: svelte.JSX.EventHandler<CustomEvent<null>, HTMLDivElement> | null | undefined;
        onoutroend?: svelte.JSX.EventHandler<CustomEvent<null>, HTMLDivElement> | null | undefined;
        onintrostart?: svelte.JSX.EventHandler<CustomEvent<null>, HTMLDivElement> | null | undefined;
        onintroend?: svelte.JSX.EventHandler<CustomEvent<null>, HTMLDivElement> | null | undefined;
        onmessage?: svelte.JSX.MessageEventHandler<HTMLDivElement> | null | undefined;
        onmessageerror?: svelte.JSX.MessageEventHandler<HTMLDivElement> | null | undefined;
        oncancel?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onclose?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onfullscreenchange?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
        onfullscreenerror?: svelte.JSX.EventHandler<Event, HTMLDivElement> | null | undefined;
    };
    events: {
        afterEnter: CustomEvent<null>;
        afterLeave: CustomEvent<null>;
        beforeEnter: CustomEvent<null>;
        beforeLeave: CustomEvent<null>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type TransitionChildProps = typeof __propDef.props;
export declare type TransitionChildEvents = typeof __propDef.events;
export declare type TransitionChildSlots = typeof __propDef.slots;
export default class TransitionChild extends SvelteComponentTyped<TransitionChildProps, TransitionChildEvents, TransitionChildSlots> {
}
export {};
