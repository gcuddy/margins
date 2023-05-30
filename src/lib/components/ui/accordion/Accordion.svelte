<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	import { Accordion, AccordionItemProps } from 'radix-svelte';

	type $$Props = Omit<AccordionItemProps, 'value'> & {
		items: {
			value: string;
			heading?: string;
			content?: string;
		}[];
	};
	export let items: $$Props['items'];
</script>

<Accordion.Root>
	{#each items as { value, heading, content }}
		<Accordion.Item {value} {...$$restProps} class="border-b">
			<Accordion.Header class="flex">
				<Accordion.Trigger
					class="group flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline"
				>
					<slot name="heading" {value} {heading}>
						{heading}
					</slot>
					<ChevronDown
						class="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180"
					/>
				</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content transition class="overflow-hidden text-sm">
				<div class="pb-4 pt-0">
					<slot name="content" {value} {heading}>
						{content}
					</slot>
				</div>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
