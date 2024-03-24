<script lang="ts">
	import { Muted } from '$components/ui/typography';
	import {Label} from '$lib/components/ui/label';
	import NativeSelect from '$lib/components/ui/NativeSelect.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import * as RadioGroup from '$components/ui/radio-group';

	import { getAppearanceContext } from '../ctx';

	const appearance = getAppearanceContext();
</script>

<div class="space-y-6">
    <div class="grid gap-3" >
		<Label class="flex" for="font-family">Font</Label>

		<RadioGroup.Root bind:value={$appearance.font} class="flex overflow-auto">
			{#each appearance.consts.fonts as font}
            <Label for="rfont-{font}" class="[&:has([data-state=checked])>div]:border-primary">
				<RadioGroup.Item value={font} id="rfont-{font}" class="sr-only" />
                <div class="p-2 flex-1 border rounded text-base {appearance.consts.fontClasses[font]}">
                    {font}
                </div>
            </Label>
			{/each}
		</RadioGroup.Root>
	</div>
    <div class="grid grid-cols-[auto,160px] items-center">
		<div class="flex flex-col">
			<Label for="font-size">Font size</Label>
			<Muted class="text-xs">{$appearance.fontSize}</Muted>
		</div>
		<Slider
			id="font-size"
			min={14}
			max={24}
			bind:value={$appearance.fontSize}
		/>
	</div>
	<div class="grid grid-cols-[auto,160px] items-center">
		<div class="flex flex-col">
			<Label for="leading">Line height</Label>
			<Muted class="text-xs">{$appearance.lineHeight}</Muted>
		</div>
		<Slider
			id="leading"
			min={1}
			max={2}
			step={0.25}
			bind:value={$appearance.lineHeight}
		/>
	</div>

	<!-- <div class="grid grid-cols-[auto,160px] items-center">
			<Label class="flex" for="alignment">Focus Mode</Label>
			<Switch bind:checked={$appearance.focusMode} />
		</div> -->
	<div class="grid grid-cols-[auto,160px] items-center">
		<Label class="flex" for="alignment">Alignment</Label>
		<NativeSelect id="alignment" bind:value={$appearance.alignment}>
			{#each appearance.consts.align as a}
				<option value={a}>
					{a}
				</option>
			{/each}
		</NativeSelect>
	</div>

    <div class="grid grid-cols-[auto,160px] items-center">
		<Label class="flex" for="alignment">Auto-hide menu</Label>
		<Switch bind:checked={$appearance.autoHide} />
	</div>


</div>
