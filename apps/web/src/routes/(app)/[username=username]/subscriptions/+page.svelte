<script lang="ts">
  import { ShellContent, ShellHeader } from "@margins/features/shell"
  import { Button } from "@margins/ui"
  import { Plus } from "svelte-radix"
</script>

<ShellHeader title="Subscriptions">
  <Button size="sm" color="gray" variant="surface">
    <Plus />
    Add subscription
  </Button>
</ShellHeader>
<ShellContent>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <h2 class="text-lg font-medium">Subscriptions</h2>
      <p class="text-gray-11 text-sm">Manage your subscriptions here.</p>
    </div>
  </div>
</ShellContent>
