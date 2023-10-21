<script lang="ts" context="module">
	type PopperActions = ReturnType<typeof createPopperActions>;
	const context_name = "__dropdown_menu";

	type State = {
		popperRef: PopperActions[0];
		popperContent: PopperActions[1];
	};

	export function useDropDownMenuContext(component: string) {
		const context = getContext(context_name);
		if (!context) {
			throw new Error(`<${component} > must be used within a DropdownMenu`);
		}
		return context as Writable<State>;
	}
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import { cn } from "$lib/utils/tailwind";
	import { Menu, MenuButton } from "@rgossiaux/svelte-headlessui";
	import { getContext, setContext } from "svelte";
	import { createPopperActions } from "svelte-popperjs";
	import { writable, Writable } from "svelte/store";
	const [popperRef, popperContent] = createPopperActions();
	const state = writable<State>({ popperRef, popperContent });
	setContext(context_name, state);
    let className = '';
    export { className as class};
</script>

<Menu let:open class={cn('relative', className)}>
	<!-- <slot name="button">
		<MenuButton use={[popperRef]}
			><slot name="button-text">Open</slot></MenuButton
		>
	</slot> -->
	<slot {open} />
</Menu>
