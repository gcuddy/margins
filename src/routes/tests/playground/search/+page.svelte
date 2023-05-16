<script lang="ts">
	import Search from '$lib/components/ui/command2/Search.svelte';
</script>

<div class="p-6">
	<Search filter={(q, i) => i.toLowerCase().includes(q.toLowerCase())} items={['Apple', 'Banana', 'Orange', 'Pineapple', 'Mango']}>
        <svelte:fragment let:item slot="item">
           {item} 
        </svelte:fragment>
    </Search>

</div>
