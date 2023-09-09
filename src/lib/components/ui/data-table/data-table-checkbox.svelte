<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { Writable } from 'svelte/store';

	import Checkbox from '$components/ui/Checkbox.svelte';

	type $$Props = Omit<ComponentProps<Checkbox>, 'checked'> & {
		checked: Writable<boolean>;
	};

	export let checked: $$Props['checked'];
</script>

<div class="flex items-center">
	<Checkbox bind:checked={$checked} {...$$restProps} />
</div>
