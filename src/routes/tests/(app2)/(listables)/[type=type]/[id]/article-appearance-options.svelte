<script lang="ts">
	import { getAppearanceContext } from '../ctx';

	import * as Popover from '$components/ui/popover';
	import * as Tooltip from '$components/ui/tooltip';
	import { cn } from '$lib';
	import Button from '$components/ui/Button.svelte';
	import { Settings2 } from 'lucide-svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import NativeSelect from '$lib/components/ui/NativeSelect.svelte';
	import Slider from '$lib/components/ui/Slider.svelte';
	import Switch from '$lib/components/ui/Switch.svelte';
	import { Muted } from '$components/ui/typography';

	const appearance = getAppearanceContext();
</script>

<Popover.Root>
	<Tooltip.Trigger asChild let:builder={tooltipBuilder}>
		<Popover.Trigger asChild let:builder={popoverBuilder}>
			<Settings2 class="h-4 w-4" />
			<span class="sr-only">Open popover</span>
		</Popover.Trigger>
	</Tooltip.Trigger>
	<Popover.Content class="max-w-sm space-y-4">
		<div class="grid grid-cols-[auto,160px] items-center">
			<Label class="flex" for="alignment">Auto-hide menu</Label>
			<Switch bind:checked={$appearance.autoHide} />
		</div>
		<div class="grid grid-cols-[auto,160px] items-center">
			<Label class="flex" for="alignment">Focus Mode</Label>
			<Switch bind:checked={$appearance.focusMode} />
		</div>
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
			<Label class="flex" for="font-family">Font</Label>
			<NativeSelect id="font-family" bind:value={$appearance.font}>
				{#each appearance.consts.fonts as a}
					<option value={a}>
						{a}
					</option>
				{/each}
			</NativeSelect>
		</div>
		<div class="grid grid-cols-[auto,160px] items-center">
			<div class="flex flex-col">
				<Label for="font-size">Font size</Label>
				<Muted class="text-xs">{$appearance.fontSize}</Muted>
			</div>
			<Slider id="font-size" min={14} max={24} bind:value={$appearance.fontSize} />
		</div>
		<div class="grid grid-cols-[auto,160px] items-center">
			<div class="flex flex-col">
				<Label for="leading">Line height</Label>
				<Muted class="text-xs">{$appearance.lineHeight}</Muted>
			</div>
			<Slider id="leading" min={1} max={2} step={0.25} bind:value={$appearance.lineHeight} />
		</div>
	</Popover.Content>
</Popover.Root>
