<script lang="ts">
	import Muted from "$lib/components/atoms/Muted.svelte";
	import Button from "$lib/components/Button.svelte";
	import Icon from "$lib/components/helpers/Icon.svelte";
	import Header from "$lib/components/layout/Header.svelte";
	import DefaultHeader from "$lib/components/layout/headers/DefaultHeader.svelte";
	import MediaEntryHeader from "$lib/components/layout/MediaEntry.svelte";
	import dayjs from "$lib/dayjs";

	export let data;
	$: query = data.query();
	$: console.log({ $query });
</script>

<svelte:head>
	<title>{$query.data?.name || "loading"}</title>
</svelte:head>

<Header>
    <DefaultHeader>
        <div slot="start">
            Games > {$query.data?.name || "loading"}
        </div>
    </DefaultHeader>
</Header>

<div class="container mx-auto flex flex-col items-center justify-center p-4">
	{#if $query.isLoading}
		Loading...
	{:else if $query.isError}
		Error
	{:else if $query.isSuccess}
		{@const game = $query.data}
		{@const image = game.cover?.url?.replace("t_thumb", "t_cover_big") || ""}
		{@const year = dayjs.unix(game.first_release_date).year()}
		<!-- filter for steam and twitch @see https://api-docs.igdb.com/#website-enums -->
		{@const websites = game.websites?.filter((website) => website.category === 6 || website.category === 13)}
		{@const official_website = game.websites?.find((website) => website.category === 1)}
		<MediaEntryHeader image_dimensions="h-auto w-44" title={game.name} {year} {image}>
			<svelte:fragment slot="top">
				{#if official_website}
					<a
						href={official_website.url}
						target="_blank"
						rel="noopener noreferrer"
						class="mt-1 flex items-center space-x-0.5 text-xs"
					>
						<Muted>Official website</Muted>
						<Icon name="arrowTopRightOnSquareMini" className="w-3 h-3 fill-muted" />
					</a>
				{/if}
			</svelte:fragment>
			<div slot="description">
				<dl class="grid">
					<div class="flex flex-col">
						<dt class="text-xs uppercase"><Muted>Platforms</Muted></dt>
						<dd>
							<Muted>
								{game.platforms.map((platform) => platform.name).join(", ")}
							</Muted>
						</dd>
					</div>
					{#if game.websites.length}
						<div class="flex flex-col">
							<dt class="text-xs uppercase"><Muted>Links</Muted></dt>
							<dd>
								{#each websites as website}
									<a
										href={website.url}
										target="_blank"
										rel="noopener noreferrer"
										class="mt-1 flex items-center space-x-0.5 text-xs"
									>
										<!-- twitch or steam logo img -->
										{#if website.category === 6}
											<!-- twitch svg -->
											<svg
                                            class="h-10 w-10"
												version="1.1"
												id="Layer_1"
												xmlns="http://www.w3.org/2000/svg"
												xmlns:xlink="http://www.w3.org/1999/xlink"
												x="0px"
												y="0px"
												viewBox="0 0 2400 2800"
												style="enable-background:new 0 0 2400 2800;"
												xml:space="preserve"
											>
												<g>
													<polygon
                                                        fill="#fff"
														points="2200,1300 1800,1700 1400,1700 1050,2050 1050,1700 600,1700 600,200 2200,200 	"
													/>
													<g>
														<g id="Layer_1-2">
															<path
																class="st1"
                                                                fill="#9146ff"
																d="M500,0L0,500v1800h600v500l500-500h400l900-900V0H500z M2200,1300l-400,400h-400l-350,350v-350H600V200h1600
				V1300z"
															/>
															<rect x="1700" y="550" class="st1" width="200" height="600" />
															<rect x="1150" y="550" class="st1" width="200" height="600" />
														</g>
													</g>
												</g>
											</svg>
										{:else if website.category === 13}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-10 w-10"
												xmlns:xlink="http://www.w3.org/1999/xlink"
												clip-rule="evenodd"
												fill-rule="evenodd"
												stroke-linejoin="round"
												stroke-miterlimit="1.41421"
												viewBox="0 0 560 400"
												><linearGradient
													id="a"
													gradientTransform="matrix(0 233 -233 0 116.626 0)"
													gradientUnits="userSpaceOnUse"
													x1="0"
													x2="1"
													y1="0"
													y2="0"
													><stop offset="0" stop-color="#111d2e" /><stop
														offset=".21"
														stop-color="#051839"
													/><stop offset=".41" stop-color="#0a1b48" /><stop
														offset=".58"
														stop-color="#132e62"
													/><stop offset=".74" stop-color="#144b7e" /><stop
														offset=".87"
														stop-color="#136497"
													/><stop offset="1" stop-color="#1387b8" /></linearGradient
												><g fill-rule="nonzero" transform="matrix(1.28755 0 0 1.28755 129.903 50)"
													><path
														d="m4.891 150.01c14.393 48.01 58.916 82.99 111.61 82.99 64.34 0 116.5-52.16 116.5-116.5 0-64.341-52.16-116.5-116.5-116.5-61.741 0-112.26 48.029-116.25 108.76 7.539 12.66 10.481 20.49 4.641 41.25z"
														fill="url(#a)"
													/><path
														d="m110.5 87.322c0 .196 0 .392.01.576l-28.508 41.412c-4.618-.21-9.252.6-13.646 2.41-1.937.79-3.752 1.76-5.455 2.88l-62.599-25.77s-1.448 23.83 4.588 41.59l44.254 18.26c2.222 9.93 9.034 18.64 19.084 22.83 16.443 6.87 35.402-.96 42.242-17.41 1.78-4.3 2.61-8.81 2.49-13.31l40.79-29.15c.33.01.67.02 1 .02 24.41 0 44.25-19.9 44.25-44.338 0-24.44-19.84-44.322-44.25-44.322-24.4 0-44.25 19.882-44.25 44.322zm-6.84 83.918c-5.294 12.71-19.9 18.74-32.596 13.45-5.857-2.44-10.279-6.91-12.83-12.24l14.405 5.97c9.363 3.9 20.105-.54 23.997-9.9 3.904-9.37-.525-20.13-9.883-24.03l-14.891-6.17c5.746-2.18 12.278-2.26 18.381.28 6.153 2.56 10.927 7.38 13.457 13.54s2.52 12.96-.04 19.1m51.09-54.38c-16.25 0-29.48-13.25-29.48-29.538 0-16.275 13.23-29.529 29.48-29.529 16.26 0 29.49 13.254 29.49 29.529 0 16.288-13.23 29.538-29.49 29.538m-22.09-29.583c0-12.253 9.92-22.191 22.14-22.191 12.23 0 22.15 9.938 22.15 22.191 0 12.254-9.92 22.183-22.15 22.183-12.22 0-22.14-9.929-22.14-22.183z"
														fill="#fff"
													/></g
												></svg
											>
											<!-- <img src="https://steamcommunity-a.akamaihd.net/public/images/ico/favicon.ico" alt="steam" class="w-3 h-3" /> -->
										{/if}
									</a>
								{/each}
							</dd>
						</div>
					{/if}
				</dl>
			</div>
			<div slot="actions">
				<div class="mt-auto">
					<Button>Save to inbox</Button>
				</div>
			</div>
			<div class="prose mx-auto">
				{@html game.summary}
			</div>
		</MediaEntryHeader>
	{/if}
</div>
