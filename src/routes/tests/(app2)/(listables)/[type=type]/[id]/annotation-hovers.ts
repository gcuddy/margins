import { onMount } from "svelte";
import AnnotationTooltip from "./AnnotationTooltip.svelte";
import { createPopperActions } from "svelte-popperjs";

const isAnnotation = (el: HTMLElement): el is HTMLElement & {
    dataset: {
        annotationId: string;
    }
} => !!el.dataset.annotationId || !!el.closest('[data-annotation-id]');

export function setup(opts?: {
    context: Map<unknown, unknown>
}) {
    const { context } = opts || {}
    onMount(() => {
        let tooltip: AnnotationTooltip | null = null;
        let timeout: number;

        const [popperRef, popperContent] = createPopperActions({
            strategy: 'fixed',
            placement: 'top',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 12]
                    }
                }
            ]
        });

        function over(event: MouseEvent) {
            const target = event.target;
            if (!target) return;
            if (target instanceof HTMLElement && isAnnotation(target)) {
                clearTimeout(timeout);

                if (!tooltip) {
                    popperRef(target);
                    tooltip = new AnnotationTooltip({
                        target: document.body,
                        props: {
                            popperContent,
                            y: -10,
                            id: target.dataset.annotationId,
                        },
                        context
                    });


                    // tooltip.$on('mouseenter', () => {
                    //     clearTimeout(timeout);
                    // });

                    // tooltip.$on('mouseleave', () => {
                    //     clearTimeout(timeout);
                    //     tooltip?.$destroy();
                    //     tooltip = null;
                    // });
                }

            } else {
                if (tooltip) {
                    tooltip?.$destroy();
                    tooltip = null;
                }
            }
        }
        function out(event: MouseEvent) {
            const target = event.target;
            if (!target) return;
            console.log({ target })
            if (target instanceof HTMLElement && (isAnnotation(target) || (isAnnotation(target) && target.closest("p")))) {
                timeout = window.setTimeout(() => {
                    tooltip?.$destroy();
                    tooltip = null;
                }, 300);
            }
        }

        // window.addEventListener('mouseover', over);
        window.addEventListener('click', over)
        // window.addEventListener('mouseout', out);

        return () => {
            window.removeEventListener('click', over);
            // window.removeEventListener('mouseover', over);
            // window.removeEventListener('mouseout', out);
        };
    })
}