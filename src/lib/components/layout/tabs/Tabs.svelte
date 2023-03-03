<script lang="ts">
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@rgossiaux/svelte-headlessui";
	export let tabs: string[] = [];
</script>

<TabGroup>
	<TabList>
		<!-- expect <Tab /> -->
		<slot name="tabs">
			{#each tabs as tab}
				<Tab>
					{tab}
				</Tab>
			{/each}
		</slot>
	</TabList>
	<TabPanels>
		<!-- expect <TabPanel /> OR use internal panel -->
		<slot name="panels">
			{#each tabs as tab}
				<TabPanel>
					<slot {tab} name="panel" />
				</TabPanel>
			{/each}
		</slot>
		<!-- <slot name="panel">
			<TabPanel>Test</TabPanel>
		</slot> -->
	</TabPanels>
</TabGroup>
