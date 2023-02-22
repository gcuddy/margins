<script lang="ts">
	// TODO: multiple
	import { createEventDispatcher, onDestroy, onMount, tick } from "svelte";
	import { tweened } from "svelte/motion";
	import { derived, writable } from "svelte/store";
	import type { number } from "zod";
	type T = $$Generic;

	type TValue = T & {
		id?: string | number;
		name?: string;
		disabled?: boolean;
        group?: string;
	};

	interface Props {
		values: TValue[];
	}

	type TProps = Props & {
		idResolver: Props["values"][number]["id"] extends undefined ? boolean : string;
	};

	export let values: TValue[];
	$: console.log({ values });

	const api = writable({
		state: {
			activeId: null,
			selectedId: null,
		},
	});

	function open() {
		expanded = true;
		dispatch("expanded", expanded);
	}

	interface $$Slots {
		option: {
			// slot name
			value: TValue;
			active: boolean;
			selected: boolean;
			index: number;
		};
		listbox: {
			activeIndex: number;
		};
		input: {
			"aria-controls": string;
			"aria-expanded": boolean;
			"aria-activedescendant": string;
			onKeydown: (event: KeyboardEvent) => void;
		};
		inputPeer: {};
		inputPeerAfter: {};
		optionContainer: {};
	}
	export let value = "";
	export let selectedValue: typeof values = [];

	$: selectedValueIds = selectedValue.map((v) => v.id);

	const toggle = (value: TValue) => {
		if (selectedValueIds.includes(value.id)) {
			selectedValue = selectedValue.filter((v) => v.id !== value.id);
		} else {
			selectedValue = [...selectedValue, value];
		}
	};
	export let activeIndex = 0;

	/**whether or not to fill the combobox with the selected value*/
	export let fillValue = true;
	let className = "";
	export { className as class };

	let staticProp = false;
	export { staticProp as static };

	// don't love this design — but not sure how to make it better
	export let input:
		| {
				class?: string;
				placeholder?: string;
		  }
		| undefined = undefined;
	export let options:
		| {
				class?: string;
		  }
		| undefined = undefined;

	export let inputParent:
		| {
				class?: string;
		  }
		| undefined = undefined;
	export let multiple = false;
	const dispatch = createEventDispatcher<{
		select: TValue;
		keydown: KeyboardEvent;
		"input-click": MouseEvent;
		expanded: boolean;
		active: TValue;
	}>();

	export let idResolver: (v: TValue) => string | number = (v: TValue) => {
		if (typeof v === "string") {
			return v;
		} else {
			const id = v.id ?? v.name;
			if (!id) {
				throw new Error("Could not resolve id");
			}
			return id;
		}
	};

	export let valueResolver: (v: T) => string = (v: any) => v.name || v.displayValue || v.value;

	let activeId = "";
	// maybe save more robustly?
	let selectedId: string | number = "";
	// let lastSelected: T | undefined;
	//  && selectedValue.includes(v))
	const setActiveIndex = () => (activeIndex = values.findIndex((v) => !v.disabled) ?? 0);
	$: console.log({ activeIndex });
	$: if (staticProp) expanded = true;
	$: console.log({ expanded });

	function handleKeydown(e: KeyboardEvent) {
		dispatch("keydown", e);
		const val = values[activeIndex];
		switch (e.key) {
			case "ArrowDown": {
				// console.log('ArrowDown');
				e.preventDefault();
				e.stopPropagation();
				if (!expanded) {
					open();
				} else {
				}
				// activeIndex = 0; ??
				activeIndex = Math.min(activeIndex + 1, values.length - 1);
				break;
			}
			case "ArrowUp": {
				e.preventDefault();
				e.stopPropagation();
				activeIndex = Math.max(activeIndex - 1, 0);
				break;
			}
			case "Enter": {
				console.log("enter", { selectedId, activeIndex });
				if (!expanded) {
					console.log("hit enter but not expanded");
					return;
				}
				e.preventDefault();
				e.stopPropagation();
				console.log({ activeIndex });
				// if (!value) {
				// 	dispatch('confirm');
				// 	return;
				// }
				if (!values.length) return;
				selectedId = idResolver(val).toString();
				if (fillValue) value = valueResolver(val);
				if (multiple) {
					toggle(val);
				} else {
					//select value
					selectedValue = [val];
				}
				close();
				dispatch("select", val);
				break;
			}
			case "Escape": {
				if (!expanded) return;
				e.preventDefault();
				// todo: flesh this out
				if (!staticProp) {
					e.stopPropagation();
				}
				if (onEscape) {
					onEscape();
				} else {
					close();
				}
				break;
				// value = values.find((v) => v.id === selectedId) ?? '';
			}
			case " ": {
				if (!multiple) return;
				console.log({ activeIndex, expanded, val });
				if (!expanded) return;
				if (activeIndex < 0) return;
				if (!val) return;
				e.preventDefault();
				dispatch("select", val);
				toggle(val);
				// toggle selection state
			}
		}
	}

	$: values, setActiveIndex();
	// $: console.log({ activeIndex });
	$: valueIds = values.map((v) => {
		const id = idResolver(v);
		return id;
	});

	let id = 0;
	function useId() {
		return id++;
	}

	let optionId = `cb-options-${useId()}`;

	export let expanded = staticProp;

	export let name = "";

	export let animateHeight = true;

	export let onEscape: (() => void) | undefined = undefined;

	const optionRefs: HTMLElement[] = [];

	$: console.log({ expanded });

	/// Read-only
	export let inputRef: HTMLElement | undefined = undefined;

	$: if ((staticProp || expanded) && activeIndex > -1) {
		tick().then(() => optionRefs[activeIndex]?.scrollIntoView({ block: "nearest" }));
	}

	function close() {
		console.log("close");
		if (!staticProp) expanded = false;
		// staticProp = false;
		// do i need to set activeIndex to -1?
		// activeIndex = -1;
		// this is probably a dumb convention, should just use on:open and on:close
		dispatch("expanded", false);
		// value = '';
	}

	function handleMove(e: MouseEvent | PointerEvent, val: TValue, active: boolean) {
		if (val.disabled) return;
		if (active) return;
		activeIndex = values.indexOf(val);
	}
	function handleLeave(e: MouseEvent | PointerEvent, val: TValue, active: boolean) {
		// console.log('handleLeave');
		if (val.disabled) return;
		if (!active) return;
		activeIndex = -1;
	}
	function handleClick(e: MouseEvent, val: TValue, active: boolean) {
		// console.log({ e, val, active });
		if (val.disabled) return e.preventDefault();
		if (!active) return;
		selectedId = idResolver(val);
		dispatch("select", val);
		if (multiple) {
			toggle(val);
		} else {
			selectedValue = [val];
		}
		if (fillValue) value = valueResolver(val);
		tick().then(() => {
			close();
			inputRef?.focus({ preventScroll: true });
		});
	}

	$: {
		if (activeIndex > -1) {
			dispatch("active", values[activeIndex]);
		}
	}

	let ro: ResizeObserver;
	export let height = tweened(200, {
		duration: 125,
	});

	onMount(() => {
		if (ref) {
			ro = new ResizeObserver(([entry]) => {
				console.log({ entry, $height });
				height.set(entry.contentRect.height);
			});
			ro.observe(ref);
		}
		if (staticProp) expanded = true;
	});

	onDestroy(() => {
		close();
		ro && ro.disconnect();
	});

	let ref: HTMLElement;

	// const height = derived(ref, ($el, set) => {
	// 	if (!$el) return;
	// 	const ro = new ResizeObserver(([entry]) => {
	// 		set(entry.contentRect.height);
	// 	});
	// 	return () => ro.disconnect();

	onMount(() => {
		const index = values.findIndex(({ id }) => selectedValueIds.includes(id));
		console.log({ index });
		if (index > -1) {
			activeIndex = index;
		}
	});
	// });
</script>

<div style:height={animateHeight ? `${$height}px` : undefined}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class={className} bind:this={ref} {...$$restProps}>
		<!-- slot props are given IF you want to use them -->
		{#if name}
			{#each selectedValue as value}
				<input type="hidden" {name} value={JSON.stringify(value)} />
			{/each}
		{/if}
		<slot
			name="input"
			aria-controls={optionId}
			aria-expanded={expanded}
			aria-activedescendant={valueIds[activeIndex].toString()}
			onKeydown={handleKeydown}
		>
			<div class={inputParent?.class}>
				<slot name="inputPeer" />
				<input
					role="combobox"
					type="text"
					bind:value
					on:keydown={handleKeydown}
					on:blur={close}
					on:blur
					on:click={(e) => {
						dispatch("input-click", e);
					}}
					on:input={() => {
						if (!expanded) {
							open();
						}
					}}
					aria-controls={optionId}
					aria-expanded={expanded}
					aria-activedescendant={valueIds[activeIndex]?.toString()}
					aria-autocomplete="list"
					class="border-none focus:ring-0 {input?.class}"
					placeholder={input?.placeholder}
					bind:this={inputRef}
				/>
				<slot name="inputPeerAfter" />
			</div>
		</slot>

		<!-- TODO: able to render multiple "groups" ? -->
		<slot name="listbox" {activeIndex}>
			{#if staticProp || expanded}
				<ul id={optionId} role="listbox" class={options?.class} aria-multiselectable={multiple}>
					<!-- TODO: (maybe) use tiny-virtual-list for rendering li  -->
					{#each values as value, index (idResolver(value))}
						{@const id = valueIds[index]}
						{@const selected = selectedValueIds.includes(id)}
						{@const active = index === activeIndex}
						<!-- don't actually use optionContainer lol, everything would break -->
						<slot name="optionContainer">
							<!-- could use a private component here? -->
							<li
								id="cb-option-{id}"
								aria-selected={!multiple ? selected : undefined}
								aria-checked={multiple ? selected : undefined}
								class="cursor-pointer"
								role="option"
								bind:this={optionRefs[index]}
								on:pointermove={(e) => handleMove(e, value, active)}
								on:mousemove={(e) => handleMove(e, value, active)}
								on:pointerleave={(e) => handleLeave(e, value, active)}
								on:mouseleave={(e) => handleLeave(e, value, active)}
								on:focus={(e) => {
									// todo?
								}}
								on:click={(e) => handleClick(e, value, active)}
							>
								<slot name="option" {value} {active} {selected} {index} />
							</li>
						</slot>
					{/each}
				</ul>
			{/if}
		</slot>
	</div>
</div>
