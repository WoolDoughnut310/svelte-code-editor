<script lang="ts">
	import { SimpleCodeEditor } from 'svelte-simple-code-editor';
	import Prism from 'prismjs';
	import Delta from 'quill-delta';
	import 'prismjs/themes/prism-tomorrow.css';
	import 'prismjs/components/prism-jsx';
	import io from 'socket.io-client';
	import { onMount } from 'svelte';

	const socket = io('http://127.0.0.1:5173/');

	let code = "import React from 'react';";
	let previousCode = code;

	let localChanges: Delta[] = [];

	onMount(() => {
		socket.on('change', (change) => {
			console.log('got socket change');
			initialChange = new Delta(change);

			applyLocalChanges();
		});
	});

	let timeout = setTimeout(() => {}, 0);

	let initialChange = new Delta();

	// $: {
	// 	code;
	// 	onChange();
	// }

	const onChange = () => {
		console.log('update');
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

			console.log('cumulated', cumulated);
			console.log('emitting transformed', transformed);
			socket.emit('change', transformed);
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

<main class="w-full h-full flex justify-center items-center">
	<div class="h-3/4 w-full overflow-auto text-lg bg-gray-800 text-white">
		<SimpleCodeEditor
			bind:value={code}
			highlight={(code) => Prism.highlight(code, Prism.languages.jsx, 'jsx')}
			tabSize={4}
			on:value-change={onChange}
			--padding="20px"
		/>
	</div>
</main>

<style global>
	:global(html, body) {
		width: 100%;
		height: 100%;
	}
</style>
