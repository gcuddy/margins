<script>
  import { ShellHeader, ShellContent } from "@margins/features/shell"
  import { Button } from "@margins/ui"
  import { Plus } from "svelte-radix"
</script>

<ShellHeader>
  <span class="text-sm font-medium">Notes</span>
  <Button size="sm" variant="surface" color="gray">
    <Plus />
    New note
  </Button>
</ShellHeader>
<ShellContent>..</ShellContent>
