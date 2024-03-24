<script lang="ts">
	import { Checkbox } from '$components//ui/checkbox';
	import type { Writable } from 'svelte/store';

	export let checked: Writable<boolean>;
</script>

<div class="flex items-center">
	<Checkbox bind:checked={$checked} />
</div>
