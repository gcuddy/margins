<script lang="ts">
    import { Badge } from "."
    import type { ComponentProps } from "svelte";
    type $$Props = ComponentProps<Badge> & {
        label?: string | undefined;
    }
    export let label = "Test Badge"
</script>

<Badge {...$$restProps}>
    {label}
</Badge>
