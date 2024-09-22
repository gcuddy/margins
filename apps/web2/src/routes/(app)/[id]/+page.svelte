<script lang="ts">
	import * as Entries from '../profile/Entries';
	import { useRxValue } from '../profile/rx.svelte';

	let { data } = $props();


    
    $effect(() => {
        console.log('id', data.id)
    })

	const entry = useRxValue(Entries.get(data.id));
	console.log({ entry });
</script>
{JSON.stringify(entry)}