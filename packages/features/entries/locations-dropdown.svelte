<script lang="ts">
  import { type Status } from "@margins/db/kysely/enums"

  import {
    locationToDisplay,
    locationToHrefs,
    locationToIcon,
    locations,
  } from "./locations.js"

  import {
    type ButtonProps,
    Dropdown,
    SmallPlus,
    buttonVariants,
  } from "@margins/ui"
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
    import { Dashboard } from "svelte-radix"

  export let status: Status
  export let onSelect: ((status: Status) => void) | undefined = undefined
  export let variant: ButtonProps["variant"] = "soft"
  export let color: ButtonProps["color"] = "gold"
  export let showAll = false
</script>

<Dropdown.Root>
  <Dropdown.Trigger class={buttonVariants({ color, variant })}>
    <svelte:component this={locationToIcon[status]} />
    <SmallPlus>
      {status}
    </SmallPlus>
    <!-- <Dropdown.TriggerIcon /> -->
  </Dropdown.Trigger>
  <Dropdown.Content {color} align="start">
    <Dropdown.Item href={`/u:${$page.data.user?.username}/all`}>
      <Dropdown.Icon icon={Dashboard} />
      All</Dropdown.Item
    >
    {#each locations as location}
      <Dropdown.Item
        on:click={onSelect ? () => onSelect?.(location) : undefined}
        href={!onSelect
          ? `/u:${$page.data.user?.username}${locationToHrefs[location]}`
          : undefined}
      >
        <Dropdown.Icon icon={locationToIcon[location]} />
        {locationToDisplay[location]}</Dropdown.Item
      >
    {/each}
  </Dropdown.Content>
</Dropdown.Root>
