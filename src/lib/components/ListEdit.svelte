<script lang="ts">
	import type { ChosenIcon } from "$lib/types/icon";
	import { chosenIcon as chosenIconSchema } from "$lib/types/icon";
	import type { Prisma } from "@prisma/client";
	import MiniSwitch from "./atoms/MiniSwitch.svelte";
	import Button from "./Button.svelte";
	import GenericInput from "./GenericInput.svelte";
	import GenericTextarea from "./GenericTextarea.svelte";
	import Icon from "./helpers/Icon.svelte";
	import IconPicker from "./IconPicker.svelte";
	export let list:
		| {
				name: string;
				private: boolean;
				icon: Prisma.JsonValue | null;
				description: string | null;
		  }
		| undefined = undefined;
	let chosenIcon: ChosenIcon;
	if (list?.icon) {
		const parsed = chosenIconSchema.safeParse(list.icon);
		if (parsed.success) chosenIcon = parsed.data;
	}

	export let pending = false;

	$: console.log({ chosenIcon });
</script>

<div class="flex flex-col p-3">
	<div />
	<div class="grid grid-cols-[auto_1fr] items-center gap-2 ">
		<div class="flex h-7 w-7 items-center">
			<IconPicker bind:chosenIcon />
			<input type="hidden" name="icon" value={JSON.stringify(chosenIcon)} />
		</div>
		<div class="flex-auto">
			<GenericInput
				data-initial-focus
				name="name"
				variant="naked"
				class="p-1 font-medium"
				value={list?.name}
			/>
		</div>
		<div class="col-start-2">
			<GenericTextarea
				variant="naked"
				name="description"
				value={list?.description ? list.description : undefined}
				class="p-1 text-sm text-gray-500 dark:text-gray-400"
			/>
		</div>
	</div>
	<div class="flex items-center justify-end gap-2">
		<MiniSwitch
			class="flex items-center justify-between gap-1 text-sm text-gray-500"
			label="Private"
			size="xs"
			enabled
			labelOnRight
			name="private"
		/>
		<Button type="submit">
			{#if pending}
				<Icon name="loading" className="animate-spin text-curent h-4 w-4" />
			{:else}
				Save
			{/if}
		</Button>
	</div>
</div>
