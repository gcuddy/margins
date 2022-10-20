export declare function disposables(): {
    requestAnimationFrame(callback: FrameRequestCallback): void;
    nextFrame(callback: FrameRequestCallback): void;
    setTimeout(callback: (args: void) => void, ms?: number | undefined): void;
    add(cb: () => void): void;
    dispose(): void;
};
