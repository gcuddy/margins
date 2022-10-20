import type { Readable, Writable } from "svelte/store";
export declare enum State {
    Open = 0,
    Closed = 1
}
export declare function hasOpenClosed(): boolean;
export declare function useOpenClosed(): Readable<State> | undefined;
export declare function useOpenClosedProvider(value: Writable<State>): void;
