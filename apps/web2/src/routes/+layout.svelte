<script>
	import '../app.css';

	let { children } = $props();
</script>

<div
	data-gray-color="sand"
	data-has-background="true"
	class="dark radix-themes text-3 font-default font-normal"
>
	{@render children()}
</div>

<style>
	div {
		overflow-wrap: break-word;
		text-size-adjust: none;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* * * * * * * * * * * * * * * * * * * */
	/*                                     */
	/*           Semantic colors           */
	/*                                     */
	/* * * * * * * * * * * * * * * * * * * */

	:where(div) {
		--color-background: white;
		--color-overlay: var(--black-a6);
		--color-panel-solid: white;
		--color-panel-translucent: rgba(255, 255, 255, 0.7);
		--color-surface: rgba(255, 255, 255, 0.85);
	}
	div.dark,
	:global(:is(.dark, .dark-theme)),
	:global(:is(.dark, .dark-theme)) :where(div:not(.light, .light-theme)) {
		--color-background: var(--gray-1);
		--color-overlay: var(--black-a8);
		--color-panel-solid: var(--gray-2);
		--color-panel-translucent: var(--gray-a2);
		--color-surface: rgba(0, 0, 0, 0.25);
	}

	/* * * * * * * * * * * * * * * * * * * */
	/*                                     */
	/*            Transparency             */
	/*                                     */
	/* * * * * * * * * * * * * * * * * * * */

	/* Because Chrome is buggy with box-shadow transitions from "transparent" keyword and/or RGB color into P3 colors. */
	/* Note: using `:where` here to guarantee that the P3 color will take over regardless of the output rule order. */
	:where(div) {
		--color-transparent: rgb(0 0 0 / 0);
	}
	@supports (color: color(display-p3 1 1 1)) {
		@media (color-gamut: p3) {
			div {
				--color-transparent: color(display-p3 0 0 0 / 0);
			}
		}
	}

	/* * * * * * * * * * * * * * * * * * * */
	/*                                     */
	/*            Color scheme             */
	/*                                     */
	/* * * * * * * * * * * * * * * * * * * */

	/*
 * Make sure that forced light/dark appearance also sets corresponding browser colors,
 * like input autofill color and body scrollbar
 */
	.div:where(.light, .light-theme) {
		:global(&),
		:global(:root:where(:has(&[data-is-root-theme='true']))) {
			color-scheme: light;
		}
	}
	.div:where(.dark, .dark-theme) {
		:global(&),
		:global(:root:where(:has(&[data-is-root-theme='true']))) {
			color-scheme: dark;
		}
	}
</style>
