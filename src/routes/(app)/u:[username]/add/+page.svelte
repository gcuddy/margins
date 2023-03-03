<script lang="ts">
	import { enhance } from '$app/forms';
	import AddModal from '$lib/components/AddForm.svelte';
	import SmallPlus from '$lib/components/atoms/SmallPlus.svelte';
	import Button from '$lib/components/Button.svelte';
	import GenericInput from '$lib/components/GenericInput.svelte';
	import Icon from '$lib/components/helpers/Icon.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import DefaultHeader from '$lib/components/layout/headers/DefaultHeader.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
	$: ({ url, title, description, html } = data);
</script>

<Header>
	<DefaultHeader>
		<div slot="start">
			<SmallPlus>Add Article</SmallPlus>
		</div>
	</DefaultHeader>
</Header>
<div class="grid">
	<!-- TODO: eventually make this be like linear with sidebar of metadta -->
	<div class="px-10 pt-[10vh]">
		<AddModal />
	</div>
</div>
