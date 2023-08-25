<script lang="ts">
	import type { Writable } from "svelte/store";

	import { patch } from "$lib/utils";

	import type { FieldPath, UnwrapEffects } from "sveltekit-superforms";
	import type { SuperForm } from "sveltekit-superforms/client";
	import { formFieldProxy } from "sveltekit-superforms/client";
	import type { z, AnyZodObject } from "zod";
	import Textarea from "../Textarea.svelte";

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<UnwrapEffects<T>, unknown>;
	export let field: keyof z.infer<T> | FieldPath<z.infer<T>>;

	const { path, value, errors, constraints } = formFieldProxy(form, field);

	$: val = value as Writable<string>;
</script>

{String(path)}

<Textarea bind:value={$val} />
