<script lang="ts">
  export let label
  let className: string | null | undefined = undefined
  export { className as class };
</script>

<span class={className}>{label}</span>
