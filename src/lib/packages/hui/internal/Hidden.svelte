<script  context="module">export var Features;
(function (Features) {
    // The default, no features.
    Features[Features["None"] = 1] = "None";
    // Whether the element should be focusable or not.
    Features[Features["Focusable"] = 2] = "Focusable";
    // Whether it should be completely hidden, even to assistive technologies.
    Features[Features["Hidden"] = 4] = "Hidden";
})(Features || (Features = {}));
</script>

<script >import Render from "../utils/Render.svelte";
export let as = "div";
export let features = Features.None;
$: propsWeControl = {
    "aria-hidden": (features & Features.Focusable) === Features.Focusable ? true : undefined,
    style: `position:fixed;top:1px;left:1px;width:1px;height:0px;padding:0px;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);whitespace:nowrap;border-width:0px;${(features & Features.Hidden) === Features.Hidden && !((features & Features.Focusable) === Features.Focusable) ? 'display:none' : ''}`
};
$: slotProps = {};
</script>

<Render
  elementName={$$restProps.name} 
  style={propsWeControl.style}
  aria-hidden={propsWeControl["aria-hidden"]}
  {...{ ...$$restProps }}
  {as}
  name={"Hidden"}
  {slotProps}
>
  <slot />
</Render>
