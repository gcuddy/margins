<script lang="ts">
	export let data;
	import { enhance } from '$app/forms';
</script>

email: {data.user.email}

<form method="post" use:enhance>
	<button data-testid="logout-btn">Sign out</button>
</form>
