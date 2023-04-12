<script lang="ts" context="module">
	const context_name = "popover__context";

	type PopperActions = ReturnType<typeof createPopperActions>;

	type PopoverContext = {
		popperRef: PopperActions[0];
		popperContent: PopperActions[1];
	};

	export function getPopoverContext() {
		const context = getContext(context_name);
		if (!context) {
			throw new Error("usePopoverContext must be used within a <Popover />");
		}
		return context as PopoverContext;
	}
	function setPopoverContext(context: PopoverContext) {
		setContext(context_name, context);
	}
</script>

<script lang="ts">
	import { Popover } from "@rgossiaux/svelte-headlessui";

	import { createPopperActions } from "svelte-popperjs";
	import { getContext, setContext } from "svelte";

	const [popperRef, popperContent, e] = createPopperActions();

	setPopoverContext({ popperRef, popperContent });
</script>

<Popover let:open let:close>
	<slot {open} {close} />
</Popover>
