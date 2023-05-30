<script lang="ts">
	import Combobox from "$lib/components/helpers/Combobox.svelte";
	import type { ComponentProps } from "svelte";
    type T = $$Generic<Object>;
    export let values: T[];

    interface $$Props extends ComponentProps<Combobox<any>> {}

</script>

<Combobox {values}>
    <!--  -->
</Combobox>