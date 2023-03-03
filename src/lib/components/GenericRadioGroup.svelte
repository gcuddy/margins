<script lang="ts">
    import {
      RadioGroup,
      RadioGroupLabel,
      RadioGroupOption,
      RadioGroupDescription,
    } from "@rgossiaux/svelte-headlessui";

    type T = $$Generic;

    export let value: T;
  </script>

  <RadioGroup {value} on:change={(e) => value = e.detail}>
    <!-- This Label is for the `RadioGroup`
    <RadioGroupLabel>Plan</RadioGroupLabel>

    <RadioGroupOption value="startup" let:checked>
      <RadioGroupLabel as="span" class:checked>Startup</RadioGroupLabel>
      <RadioGroupDescription as="span" class:checked>
        Up to 5 active job postings
      </RadioGroupDescription>
    </RadioGroupOption> -->
    <slot />
    <!-- ... -->
  </RadioGroup>
