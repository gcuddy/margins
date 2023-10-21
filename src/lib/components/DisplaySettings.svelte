<script lang="ts">
	import Select from "$lib/components/atoms/Select.svelte";
	import GenericRadioGroup from "$lib/components/GenericRadioGroup.svelte";
	import { RadioGroupLabel, RadioGroupOption } from "@rgossiaux/svelte-headlessui";

	const fonts = ["newsreader", "inter", "crimson", "system"] as const;

	type Settings = {
		font: (typeof fonts)[number];
		fontSize: number;
		spacing: number;
	};

	export let settings: Settings = {
		font: "newsreader",
		fontSize: 16,
		spacing: 1.5,
	};
</script>

<div class="flex flex-col p-8">
	<div class="flex justify-between">
		<!-- fonts -->
		<!-- TODO: make this a nice presentation like books -->

		<GenericRadioGroup bind:value={settings.font}>
				<RadioGroupOption value={"newsreader"}>
					<RadioGroupLabel class="font-newsreader">Newsreader</RadioGroupLabel>
				</RadioGroupOption>
				<RadioGroupOption value={"crimson"}>
					<RadioGroupLabel class="font-crimson">Crimson</RadioGroupLabel>
				</RadioGroupOption>
				<RadioGroupOption value={"inter"}>
					<RadioGroupLabel class="font-inter">inter</RadioGroupLabel>
				</RadioGroupOption>
				<RadioGroupOption value={"system"}>
					<RadioGroupLabel class="font-sans">system</RadioGroupLabel>
				</RadioGroupOption>
		</GenericRadioGroup>
	</div>

	<div>
		<!-- text size -->
	</div>

	<div>
		<!-- spacing -->
	</div>

	<!-- button for custom css -->
</div>
