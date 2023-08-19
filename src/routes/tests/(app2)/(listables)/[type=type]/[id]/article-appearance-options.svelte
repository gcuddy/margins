<script lang="ts">
	import { getAppearanceContext } from "../ctx";


    const appearance = getAppearanceContext();
</script>

<Popover>
    <PopoverTrigger
        bind:ref={options_el}
        class={cn(
            buttonVariants({
                variant: 'outline'
            }),
            'w-10 rounded-full p-0'
        )}
    >
        <Settings2 class="h-4 w-4" />
        <span class="sr-only">Open popover</span>
    </PopoverTrigger>
    <PopoverContent class="max-w-sm space-y-4" placement="top-start">
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
                {#each align as a}
                    <option value={a}>
                        {a}
                    </option>
                {/each}
            </NativeSelect>
        </div>
        <div class="grid grid-cols-[auto,160px] items-center">
            <Label class="flex" for="font-family">Font</Label>
            <NativeSelect id="font-family" bind:value={$appearance.font}>
                {#each fonts as a}
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
    </PopoverContent>
</Popover>
