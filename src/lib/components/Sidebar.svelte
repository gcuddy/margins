<script context="module" lang="ts">
	export interface Link {
		text: string;
		href?: string;
		id: string | number;
		visible?: boolean;
		icon?: IconName;
		children?: Omit<Link, 'children'>[];
	}
</script>

<script lang="ts">
	import { icons, type IconName } from '$lib/icons';
	import Disclosure from './Disclosure.svelte';
	import Icon from './helpers/Icon.svelte';
	//TODO: add customizing colors/css
	export let links: Link[][] = [];
</script>

<!-- https://flowbite.com/docs/components/sidebar/ -->
<aside class="w-64" aria-label="Sidebar">
	<div class="overflow-y-auto rounded bg-gray-50 py-4 px-3 dark:bg-gray-800">
		{#each links as group, index (index)}
			<ul
				class="space-y-2 {index > 0 && 'mt-4 border-t border-gray-200 pt-4 dark:border-gray-700'}"
			>
				{#each group as link (link.id)}
					<li>
						{#if !link.children}
							<a
								href={link.href}
								class="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
							>
								{#if link.icon}
									<svg
										class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
									>
										{@html icons[link.icon]}
									</svg>
								{/if}
								<span class={link.icon && 'ml-3'}>{link.text}</span>
							</a>
						{:else if link.children?.length > 0}
							<Disclosure className="w-full" visible={link.visible || false}>
								<div
									slot="button"
									class="flex items-center rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
								>
									{#if link.icon}
										<svg
											class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											{@html icons[link.icon]}
										</svg>
									{/if}
									<span class={link.icon && 'ml-3'}>{link.text}</span>
									<div class="ml-auto">
										<Icon name="chevron" direction="s" />
									</div>
								</div>
								<div slot="content">
									{#each link.children as child (child.id)}
										<a
											href={child.href}
											class="flex items-center p-2 pl-11 w-full text-base font-normal text-gray-900 rounded-lg transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
										>
											{#if child.icon}
												<svg
													class="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
													fill="currentColor"
													viewBox="0 0 20 20"
													xmlns="http://www.w3.org/2000/svg"
												>
													{@html icons[child.icon]}
												</svg>
											{/if}
											<span class={child.icon && 'ml-3'}>{child.text}</span>
										</a>
									{/each}
								</div>
							</Disclosure>
						{/if}
					</li>
				{/each}
			</ul>
		{/each}
	</div>
</aside>
