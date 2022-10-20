<script >import Listbox from "./Listbox.svelte";
export let value;
</script>

<Listbox {value} on:change={(e) => (value = e.detail)} on:change>
  <slot />
</Listbox>
