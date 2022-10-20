<script  context="module">function isSingleComponent(props) {
    return (typeof props === "string" ||
        (Array.isArray(props) &&
            !Array.isArray(props[0]) &&
            typeof props[0] !== "string"));
}
export {};
</script>

<script >export let allProps;
let spreadProps = {};
let onChange = () => { };
let onClose = () => { };
let onFocus = () => { };
let onKeydown = () => { };
let onSubmit = () => { };
let onClick = () => { };
if (allProps && typeof allProps !== "string" && isSingleComponent(allProps)) {
    ({
        onChange = onChange,
        onClose = onClose,
        onFocus = onFocus,
        onKeydown = onKeydown,
        onSubmit = onSubmit,
        onClick = onClick,
        ...spreadProps
    } = allProps[1] || {});
}
</script>

{#if allProps}
  {#if isSingleComponent(allProps)}
    {#if typeof allProps === "string"}
      {allProps}
    {:else}
      <svelte:component
        this={allProps[0]}
        {...spreadProps}
        on:change={onChange}
        on:close={onClose}
        on:focus={onFocus}
        on:keydown={onKeydown}
        on:submit={onSubmit}
        on:click={onClick}
      >
        <svelte:self allProps={allProps[2]} />
      </svelte:component>
    {/if}
  {:else}
    {#each allProps as childProps}
      <svelte:self allProps={childProps} />
    {/each}
  {/if}
{/if}
