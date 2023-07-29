<script lang="ts">
	import Button from '$components/ui/Button.svelte';
	import { cn } from '$lib/utils/tailwind';
	import { InfoIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	export let scrollingDown = getContext('scrollingDown') as Writable<boolean> || writable(false);

    $: hide = $scrollingDown;

    $: console.log({$scrollingDown})

    const rightSidebar = getContext("rightSidebar") as Writable<boolean>;

    // TODO: await tick after navigating before listening to scrollingDown
</script>

<!--  -->

<div class={cn(
    "fixed flex items-center justify-between z-50 left-0 top-0 w-full h-[--nav-height] border-b bg-background transition-transform duration-200 ease-in-out transform",
    $scrollingDown && "-translate-y-full "
)}>
    <div class="flex items-start justify-start w-full relative px-4">
        <div class="left">
            <!--  -->
        </div>
        <div class="center flex-1">
            <!--  -->
        </div>
        <div class="right">
            <Button
                    on:click={() => $rightSidebar = !$rightSidebar}
                    variant="outline"
                    class="w-10 rounded-full p-0"
                >
                    <InfoIcon class="h-4 w-4" />
                </Button>
            <span class="sr-only">Toggle right sidebar</span>
        </div>
    </div>
</div>

