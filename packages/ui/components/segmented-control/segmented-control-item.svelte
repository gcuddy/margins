<script lang="ts">
  import { ToggleGroup } from "bits-ui"
  export let value: string
</script>

<ToggleGroup.Item {value} class="m-reset m-SegmentedControlItem">
  <span class="m-SegmentedControlItemSeparator" />
  <span class="m-SegmentedControlItemLabel">
    <span class="m-SegmentedControlItemLabelActive"><slot /></span>
    <span class="m-SegmentedControlItemLabelInactive"><slot /></span>
  </span>
</ToggleGroup.Item>
