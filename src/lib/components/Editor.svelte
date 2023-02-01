<script lang="ts">
	import { getContext, onMount } from 'svelte';

	import type { Client } from '$lib/server/socket/types';
	import type { FileClass } from '$lib/server/models';

	import { SimpleCodeEditor } from 'svelte-simple-code-editor';
	import Delta from 'quill-delta';

	import Prism from 'prismjs';
	import 'prismjs/themes/prism-tomorrow.css';
	import { project } from '$lib/stores';

	export let file: FileClass;

	const socket = getContext<Client>('socket');

	// Code content as seen in the DOM
	let code = file.content.length ? (file.content[0].insert as string) : '';

	// Used to compare with new code, during updates
	let previousCode = code;

	// Stores all the changes applied
	let localChanges: Delta[] = [];

	// Before sending local updates to the server,

	let timeout = setTimeout(() => {}, 0);

	// Stores the initial change
	// e.g. an update from the server
	// or the last local change applied
	let initialChange = new Delta();

	onMount(() => {
		socket.on('change', (filename, change) => {
			// TODO, update the store when
			// changes for other files are received
			if (filename !== file.name) return;
			initialChange = new Delta(change);

			applyLocalChanges();
		});
	});

	const onChange = () => {
		localChanges = [
			...localChanges,
			new Delta().insert(previousCode).diff(new Delta().insert(code))
		];
		previousCode = code;

		clearTimeout(timeout);
		timeout = setTimeout(applyLocalChanges, 1000);
	};

	const applyLocalChanges = () => {
		let final = initialChange;

		if (localChanges.length) {
			let cumulated = localChanges.reduce((prev, cur) => prev.compose(cur));

			const transformed = final.transform(cumulated, true);

			// initial + cumulated
			final = final.compose(transformed);

			final = cumulated.invert(new Delta()).compose(final);
		}

		// Apply final change
		const newDoc = new Delta().insert(code).compose(final);

		// If new code is empty after operations
		if (newDoc.length() === 0) {
			code = '';
		} else {
			code = (newDoc.ops[0]?.insert as string) ?? '';
		}

		previousCode = code;

		initialChange = new Delta();
		localChanges = [];
	};
</script>

<div>
	<SimpleCodeEditor
		bind:value={code}
		highlight={(code) => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
		tabSize={4}
		on:value-change={onChange}
		--padding="20px"
	/>
</div>
