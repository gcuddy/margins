<script lang="ts">
  import { Command as CommandPrimitive } from "cmdk-sv"
  import { cn } from "@margins/lib"
  import { baseMenu } from "../base-menu.js"

  type $$Props = CommandPrimitive.CommandProps & {
    checkbox?: boolean
    size?: "sm" | "md" | "lg"
  }

  export let value: $$Props["value"] = undefined

  let className: string | undefined | null = undefined
  export let size: $$Props["size"] = 'lg'
  export { className as class }

  // setContext("__command_registry__", )
</script>

<CommandPrimitive.Root
  class={cn(
    baseMenu({
      size,
    }),
    "dark flex h-full w-full flex-col overflow-hidden rounded-md",
    className,
  )}
  bind:value
  {...$$restProps}
>
  <slot />
</CommandPrimitive.Root>
