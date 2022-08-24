<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	import Form from '$lib/components/Form.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';

	import Header from '$lib/components/layout/Header.svelte';
	import { notifications } from '$lib/stores/notifications';

	let pending_add_item = false;
</script>

<slot />
