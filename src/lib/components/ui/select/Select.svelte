<script lang="ts" context="module">
	const context_name = "select__context";

	type PopperActions = ReturnType<typeof createPopperActions>;

	type SelectContext = {
		popperRef: PopperActions[0];
		popperContent: PopperActions[1];
	};

	export function getSelectContext() {
		const context = getContext(context_name);
		if (!context) {
			throw new Error("getSelectContext must be used within a <Select />");
		}
		return context as SelectContext;
	}
	function setSelectContext(context: SelectContext) {
		setContext(context_name, context);
	}
</script>

<script lang="ts">
	import { createPopperActions } from "svelte-popperjs";

	import {
		Listbox,
		ListboxButton,
		ListboxOptions,
		ListboxOption,
	} from "@rgossiaux/svelte-headlessui";
	import { ComponentProps, getContext, setContext } from "svelte";

	type T = $$Generic<string | number | string[] | null | undefined>;

	interface $$Props extends ComponentProps<Listbox<"div">> {
		value?: T;
	}

	const [popperRef, popperContent] = createPopperActions();
	setSelectContext({ popperRef, popperContent });

	export let value: T | undefined = undefined;
</script>

<Listbox class="not-prose" {value} on:change={(e) => (value = e.detail)}>
	<slot />
</Listbox>
