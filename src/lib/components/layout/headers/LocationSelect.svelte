<script>
	import Menu from '$lib/components/Menu/Menu.svelte';
</script>

<Menu
	menuItems={[
		[
			{
				id: 0,
				display: 'Inbox',
				perform: () => {
					console.log('Inbox');
				},
				icon: 'inbox'
			}
		]
	]}
/>
