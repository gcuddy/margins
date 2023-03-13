<script lang="ts">
	export let data;
</script>

<article class="mx-auto max-w-prose select-text space-y-4 text-black">
	<h1>What are some things Margins can do for you?</h1>
	<!-- TODO: markdown -->
	{@html data.content}
	<!-- <p>
		There are many excellent tools for saving, reading, bookmarking, annotating, researching, and keeping up
		with things on the web. Broadly, we might view these tools as part of Personal Knowledge Management (PKM).
		Some that I have used and recommend include Hypothes.is, Instapaper, Pocket, Readwise Reader, Fraidyc.at,
		Worldbrain Memex. Apps like DevonThink and Evernote could be defined as research apps, as well. In the
		realm of subscription (RSS) apps, we have web services like Feedbin, Feedly, InoReader, Readwise Reader,
		Fraidyc.at, and offline apps like NetNewsWire or Reeder.
	</p>
	<p class="bold">So why Margins? What makes it different?</p>
	<p>
		Margins aims to be a *great* place for you to consume material, take notes, sort through things, think
		things through. It's an all-encompassing research app. One thing it's *not* is a writing app. (In
    Zettelkasten terms, Margins is for your literature notes. You'll want to get your notes *out* of Margins
		to use them for other things. Luckily, we make that not only easy, but effortless with Integrations. Plus,
		we have something in the pipeline to help you publish those notes evenmore.)
	</p> -->
</article>

<style>
	article h1 {
		font-family: "Warbler Variable Web";
		font-size: 48pt;
		line-height: 1;
		font-variation-settings: "opsz" 48;
	}
	article :global(p) {
		font-family: "Warbler Text Web";
		font-size: 20px;
		line-height: 1.6em;
		hyphens: true;
		font-synthesis: none;
	}
	article :global(h2) {
		font-family: "Warbler Variable Web";
		font-size: 24pt;
		line-height: 1;
		margin-top: 1.5em !important;
		font-variation-settings: "opsz" 32;
	}
	.bold,
	strong {
		font-family: "Warbler Text Web";
		font-size: 20px;
		line-height: 1.6em;
		hyphens: true;
		font-synthesis: none;
		font-weight: bold;
	}
	article :global(img) {
        /* min-width: 100%;
		position: relative;
		left: 50%;
		right: 50%;
		left: 50%;
		transform: translateX(-50%);
        max-width: 70vw; */
	}
</style>
