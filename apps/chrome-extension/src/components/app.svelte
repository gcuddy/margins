<script lang="ts">
	export let sessionID: string;
	import { Button } from '@margins/ui';

	async function save() {
		sessionID;
	}
</script>

<Button
	on:click={() => {
		save();
	}}>Save</Button
>

<Button>Annotate</Button>
