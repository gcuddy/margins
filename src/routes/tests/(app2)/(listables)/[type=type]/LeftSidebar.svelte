<script context="module" lang="ts">
    export const leftSidebarPortal = make_portal('[data-left-sidebar]');
</script>

<script lang='ts'>
	import Button from "$components/ui/Button.svelte";
	import { make_portal } from "$lib/actions/utils";
	import { ArrowLeft } from "lucide-svelte";


</script>

<nav class="h-[--nav-height] flex items-center">
    <Button as="a" href="/tests/library/backlog">
        <ArrowLeft />
    </Button>
</nav>
<div data-left-sidebar>
    <!--  -->
</div>
