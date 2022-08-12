<script lang="ts">
	export let value: string;
</script>

<select bind:value>
	<slot />
</select>
