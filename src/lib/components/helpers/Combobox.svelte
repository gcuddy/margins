<script lang="ts">
	// TODO: multiple
	import { createEventDispatcher, onDestroy, tick } from 'svelte';
	import { writable } from 'svelte/store';
	type T = $$Generic;
	type TValue = T;
	export let values: TValue[];

	interface StateDefinition<T> {
		selected: {
			id: string;
			value: T;
		}[];
		open: boolean;
		state: {
			activeId: string | null;
			selectedId: string | null;
		};
		options: { id: string; dataRef: ComboboxOptionDataRef<T> }[];
		activeId: string | null;
		activationTrigger: ActivationTrigger;
	}
	function createApi<T>() {
		const { subscribe, set, update } = writable<StateDefinition<T>>({
			state: {
				selectedId: null,
				activeId: null
			}
		});
	}
	const x = createApi();
	const api = writable({
		state: {
			activeId: null,
			selectedId: null
		}
	});

	function open() {
		expanded = true;
		dispatch('expanded', expanded);
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
			'aria-controls': string;
			'aria-expanded': boolean;
			'aria-activedescendant': string;
			onKeydown: (event: KeyboardEvent) => void;
		};
	}
	export let value = '';
	export let selectedValue: T[] = [];
	export let activeIndex = 0;
	export let fillValue = true;
	let className = '';
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

	// export let multiple = false;
	const dispatch = createEventDispatcher<{
		select: TValue;
		keydown: KeyboardEvent;
		'input-click': MouseEvent;
		expanded: boolean;
		active: TValue;
	}>();

	export let idResolver: (v: T) => string | number = (v: any) => {
		if (typeof v === 'string') {
			return v;
		} else {
			return v.id ?? v.value ?? v.name;
		}
	};

	export let valueResolver: (v: T) => string = (v: any) => v.name || v.displayValue || v.value;

	let activeId = '';
	// maybe save more robustly?
	let selectedId = '';
	// let lastSelected: T | undefined;

	const setActiveIndex = () => (activeIndex = values.findIndex((v) => !v.disabled) ?? 0);

	function handleKeydown(e: KeyboardEvent) {
		dispatch('keydown', e);
		switch (e.key) {
			case 'ArrowDown': {
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
			case 'ArrowUp': {
				e.preventDefault();
				e.stopPropagation();
				activeIndex = Math.max(activeIndex - 1, 0);
				break;
			}
			case 'Enter': {
				if (!expanded) {
					// console.log('hit enter but not expanded');
					return;
				}
				e.preventDefault();
				e.stopPropagation();
				// console.log({ activeIndex, values });
				const val = values[activeIndex];
				// if (!value) {
				// 	dispatch('confirm');
				// 	return;
				// }
				if (!values.length) return;
				selectedId = idResolver(val);
				if (fillValue) value = valueResolver(val);
				close();
				dispatch('select', val);
				break;
			}
			case 'Escape': {
				if (!expanded) return;
				e.preventDefault();
				// todo: flesh this out
				if (!staticProp) {
					e.stopPropagation();
				}
				close();
				// value = values.find((v) => v.id === selectedId) ?? '';
			}
		}
	}

	$: values, setActiveIndex();
	// $: console.log({ activeIndex });
	$: valueIds = values.map((v) => {
		const id = idResolver(v);
		if (!id) {
			throw Error('A proper idResolver must be applied.');
		}
		return id;
	});

	let id = 0;
	function useId() {
		return id++;
	}

	let optionId = `cb-options-${useId()}`;

	export let expanded = false;

	export let name = '';

	const optionRefs: HTMLElement[] = [];
	let inputRef: HTMLElement;

	$: if ((staticProp || expanded) && activeIndex > -1) {
		tick().then(() => optionRefs[activeIndex]?.scrollIntoView({ block: 'nearest' }));
	}

	function close() {
		expanded = false;
		// staticProp = false;
		// console.log('close');
		// do i need to set activeIndex to -1?
		// activeIndex = -1;
		// this is probably a dumb convention, should just use on:open and on:close
		dispatch('expanded', expanded);
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
		dispatch('select', val);
		if (fillValue) value = valueResolver(val);
		tick().then(() => {
			close();
			inputRef?.focus({ preventScroll: true });
		});
	}

	$: {
		if (activeIndex > -1) {
			dispatch('active', values[activeIndex]);
		}
	}

	onDestroy(() => {
		close();
	});
</script>

<div class={className}>
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
		aria-activedescendant={valueIds[activeIndex]}
		onKeydown={handleKeydown}
	>
		<input
			role="combobox"
			type="text"
			bind:value
			on:keydown={handleKeydown}
			on:blur={close}
			on:click={(e) => {
				dispatch('input-click', e);
			}}
			on:input={() => {
				if (!expanded) {
					open();
				}
			}}
			aria-controls={optionId}
			aria-expanded={expanded}
			aria-activedescendant={valueIds[activeIndex]}
			aria-autocomplete="list"
			class={input?.class}
			placeholder={input?.placeholder}
			bind:this={inputRef}
		/>
	</slot>

	<!-- TODO: able to render multiple "groups" ? -->
	<slot name="listbox" {activeIndex}>
		{#if staticProp || expanded}
			<ul id={optionId} role="listbox" class={options?.class}>
				<!-- TODO: (maybe) use tiny-virtual-list for rendering li  -->
				{#each values as value, index (idResolver(value))}
					{@const id = valueIds[index]}
					{@const selected = id === selectedId}
					{@const active = index === activeIndex}
					<!-- don't actually use optionContainer lol, everything would break -->
					<slot name="optionContainer">
						<!-- could use a private component here? -->
						<li
							id="cb-option-{id}"
							aria-selected={selected}
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
