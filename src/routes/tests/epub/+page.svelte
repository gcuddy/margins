<script lang="ts">
	import ePub from "epubjs";
	import { onMount } from "svelte";

	onMount(() => {
		var book = ePub();
		var rendition;

		var inputElement = document.getElementById("input");

		inputElement.addEventListener("change", function (e) {
			var file = e.target.files[0];
			if (window.FileReader) {
				var reader = new FileReader();
				reader.onload = openBook;
				reader.readAsArrayBuffer(file);
			}
		});

		function openBook(e) {
			var bookData = e.target.result;
			var title = document.getElementById("title");
			var next = document.getElementById("next");
			var prev = document.getElementById("prev");

			book.open(bookData, "binary");

			rendition = book.renderTo("viewer", {
				width: "100%",
				height: 600,
			});

			rendition.display();

			var keyListener = function (e) {
				// Left Key
				if ((e.keyCode || e.which) == 37) {
					rendition.prev();
				}

				// Right Key
				if ((e.keyCode || e.which) == 39) {
					rendition.next();
				}
			};

			rendition.on("keyup", keyListener);
			rendition.on("relocated", function (location) {
				console.log(location);
			});
			rendition.themes.default({
				p: {
					"font-family": "Georgia !important",
				},
				body: {
					"font-size:": "20px !important",
				},
			});
			// Apply a class to selected text
			rendition.on("selected", function (cfiRange, contents) {
				rendition.annotations.highlight(cfiRange, {}, (e) => {
					console.log("highlight clicked", e.target);
				});
				contents.window.getSelection().removeAllRanges();
			});

			rendition.themes.default({
				"::selection": {
					background: "rgba(255,255,0, 0.3)",
				},
				".epubjs-hl": {
					fill: "yellow",
					"fill-opacity": "0.3",
					"mix-blend-mode": "multiply",
				},
			});

			// Illustration of how to get text from a saved cfiRange
			var highlights = document.getElementById("highlights");

			rendition.on("selected", function (cfiRange) {
				book.getRange(cfiRange).then(function (range) {
					var text;
					var li = document.createElement("li");
					var a = document.createElement("a");
					var remove = document.createElement("a");
					var textNode;

					if (range) {
						text = range.toString();
						textNode = document.createTextNode(text);

						a.textContent = cfiRange;
						a.href = "#" + cfiRange;
						a.onclick = function () {
							rendition.display(cfiRange);
						};

						remove.textContent = "remove";
						remove.href = "#" + cfiRange;
						remove.onclick = function () {
							rendition.annotations.remove(cfiRange);
							return false;
						};

						li.appendChild(a);
						li.appendChild(textNode);
						li.appendChild(remove);
						highlights.appendChild(li);
					}
				});
			});

			next.addEventListener(
				"click",
				function (e) {
					rendition.next();
					e.preventDefault();
				},
				false
			);

			prev.addEventListener(
				"click",
				function (e) {
					rendition.prev();
					e.preventDefault();
				},
				false
			);

			document.addEventListener("keyup", keyListener, false);
		}
	});
</script>

<div id="title"><input type="file" id="input" /></div>
<div id="viewer" class="spreads" />
<a id="prev" href="#prev" class="arrow">‹</a>
<a id="next" href="#next" class="arrow">›</a>
<div id="extras">
    <ul id="highlights"></ul>
  </div>

<style>
	:global(::selection) {
		background: yellow;
	}

	:global(#extras) {
		width: 600px;
		margin: 40px auto;
	}

	:global(#highlights) {
		list-style: none;
		margin-left: 0;
		padding: 0;
	}

	:global(#highlights li) {
		list-style: none;
		margin-bottom: 20px;
		border-top: 1px solid #e2e2e2;
		padding: 10px;
	}

	:global(#highlights a) {
		display: block;
	}

	:global(#viewer.spreads) {
		top: 0;
		margin-top: 50px;
	}

	:global([ref="epubjs-mk"]) {
		background: url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPScxLjEnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycgeG1sbnM6eGxpbms9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnIHg9JzBweCcgeT0nMHB4JyB2aWV3Qm94PScwIDAgNzUgNzUnPjxnIGZpbGw9JyNCREJEQkQnIGlkPSdidWJibGUnPjxwYXRoIGNsYXNzPSdzdDAnIGQ9J00zNy41LDkuNEMxOS42LDkuNCw1LDIwLjUsNSwzNC4zYzAsNS45LDIuNywxMS4zLDcuMSwxNS42TDkuNiw2NS42bDE5LTcuM2MyLjgsMC42LDUuOCwwLjksOC45LDAuOSBDNTUuNSw1OS4yLDcwLDQ4LjEsNzAsMzQuM0M3MCwyMC41LDU1LjQsOS40LDM3LjUsOS40eicvPjwvZz48L3N2Zz4=")
			no-repeat;
		width: 20px;
		height: 20px;
		cursor: pointer;
		margin-left: 0;
	}
</style>
