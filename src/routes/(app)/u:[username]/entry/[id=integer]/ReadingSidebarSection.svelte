<script>
	import Muted from "$lib/components/atoms/Muted.svelte";
	import SmallPlus from "$lib/components/atoms/SmallPlus.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";

	import { Disclosure, DisclosureButton, DisclosurePanel } from "@rgossiaux/svelte-headlessui";
	import { slide } from "svelte/transition";
	export let defaultOpen = true;
</script>

<Disclosure {defaultOpen} let:open class="flex flex-col space-y-3 p-2 text-sm">
	<div class="flex items-center justify-between">
		<DisclosureButton
			class="group -ml-2 flex items-center gap-2 rounded py-1 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 "
		>
			<SmallPlus><Muted class="group-hover:text-gray-50"><slot name="heading" /></Muted></SmallPlus>
			<Icon
				name="chevronUpMini"
				className="h-4 w-4 fill-gray-400 opacity-0 group-hover:opacity-100 transition-transform {!open
					? '!rotate-180'
					: ''}"
			/>
		</DisclosureButton>
		<slot name="action" />
	</div>
	{#if open}
		<div
            class="z-[1]"
			transition:slide|local={{
				duration: 200,
			}}
		>
			<DisclosurePanel class="flex flex-col gap-3" static>
				<slot />
			</DisclosurePanel>
		</div>
	{/if}
</Disclosure>
