<script lang="ts">
  import { ShellContent, ShellHeader } from "@margins/features/shell"
  import { Button } from "@margins/ui"
  import { Plus } from "svelte-radix"
</script>

<ShellHeader title="Collections">
  <Button size="sm" color="gray" variant="surface" href="/u:gus/collections/new">
    <Plus />
    Add Collection
  </Button>
</ShellHeader>
<ShellContent>
  <slot />
</ShellContent>
