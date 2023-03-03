<script lang="ts">
	import { modals } from "$lib/stores/modals";
	import { DatePicker } from "date-picker-svelte";
	// export let input = false;
	export let value: Date | null = null;
   export let onConfirm: (date: Date) => void = () => {};
   export let modalId = "date-picker";
</script>

<div class="">
	<!-- {value} -->
	<DatePicker on:select={() => {
        if (value) onConfirm(value);
        if (modalId) modals.close({
            id: "date-picker"
        });
    }} bind:value />
</div>
