import type { Writable } from "svelte/store";

export type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error';

export default function imagestatus(node: HTMLImageElement, state: Writable<ImageLoadingStatus>) {

    if (!node.src) {
        state.set('error');
        return;
    }
    if (node.naturalWidth) {
        state.set('loaded');
        return; // already loaded
    }

    function load() {
        if (node.naturalWidth) {
            state.set('loaded');
            return; // already loaded
        }

        node.style.opacity = '0';
        node.style.transition = 'opacity 0.4s';


        state.set('loading');

        node.addEventListener(
            'load',
            () => {
                state.set('loaded');
                node.style.opacity = '1';
            },
            {
                once: true
            }
        );

        node.addEventListener(
            'error',
            () => {
                state.set('error');
            }
        );

    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.attributeName === 'src') {
                load();
            }
        }
    });

    observer.observe(node, {
        attributes: true
    });

    load();

    return {
        destroy() {
            observer.disconnect();
        }
    };
}