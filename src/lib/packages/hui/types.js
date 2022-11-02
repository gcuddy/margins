/// <reference types="svelte2tsx/svelte-jsx" />
// Can't figure out how to import from Render.svelte, so this must be moved here instead.
export var Features;
(function (Features) {
    /** No features at all */
    Features[Features["None"] = 0] = "None";
    /**
     * When used, this will allow us to use one of the render strategies.
     *
     * **The render strategies are:**
     *    - **Unmount**   _(Will unmount the component.)_
     *    - **Hidden**    _(Will hide the component using the [hidden] attribute.)_
     */
    Features[Features["RenderStrategy"] = 1] = "RenderStrategy";
    /**
     * When used, this will allow the user of our component to be in control. This can be used when
     * you want to transition based on some state.
     */
    Features[Features["Static"] = 2] = "Static";
})(Features || (Features = {}));
