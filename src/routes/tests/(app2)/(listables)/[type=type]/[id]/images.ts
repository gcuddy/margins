import { createPopperActions } from "svelte-popperjs"
import ImageTooltip from "./ImageTooltip.svelte";
const image_tools = (node: HTMLElement) => {

    // when we hover or tap an image, we want to mount a svelte component menu absolutely positioned in the bottom right
    // of the image.  The menu will have buttons for editing, deleting, and downloading the image.
    //
    // The menu will be a svelte component that takes the image as a prop, and has a close button that will unmount the
    let imagetools: ImageTooltip | null = null;
    const [popperRef, popperContent] = createPopperActions();
    const over = (e: MouseEvent) => {
        if (e.target instanceof HTMLImageElement) {
            popperRef(e.target);
            e.target.parentElement
            if (!imagetools) {
                imagetools = new ImageTooltip({
                    target: e.target.parentElement ?? document.body,
                    props: {
                        popperContent
                    }
                }
                )
            }
        } else {
            imagetools?.$destroy()
            imagetools = null;
        }
    }

    node.addEventListener("mousemove", over)

    return {
        destroy() {
            node.removeEventListener("mousemove", over)
        }
    }
}

export default image_tools;