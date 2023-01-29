<script lang="ts">
	import { SimpleCodeEditor } from 'svelte-simple-code-editor';
	import Prism from 'prismjs';
	import Delta from 'quill-delta';
	import { getContext, onMount } from 'svelte';
	import type { Client } from '$lib/server/socket/types';
	import { page } from '$app/stores';
	import type { PageData } from '../../routes/project/[project]/$types';
	import 'prismjs/themes/prism-tomorrow.css';
	import 'prismjs/components/prism-jsx';
	import { EJSON } from 'bson';
	import { invalidateAll } from '$app/navigation';

	export let filename = '';

	const socket = getContext<Client>('socket');
	let code = "import React from 'react';";
	let previousCode = code;

	let localChanges: Delta[] = [];

	const project = EJSON.deserialize($page.data.project) as PageData['project'];

	const file = project.files.find((file) => file.name === filename);

	onMount(() => {
		if (!file) return;
		code = file.content.length ? (file.content[0].insert as string) : '';
		previousCode = code;

		socket.on('connect', () => {
			console.log('connected now');
		});

		socket.on('change', (id, change) => {
			console.log('got socket change');
			initialChange = new Delta(change);

			applyLocalChanges();
		});
	});

	let timeout = setTimeout(() => {}, 0);

	let initialChange = new Delta();

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

			console.log('intial', initialChange, 'local', localChanges);
			console.log('cumulated', cumulated);
			console.log('emitting transformed', transformed);
			socket.emit('change', file._id.toString(), transformed);
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
		highlight={(code) => Prism.highlight(code, Prism.languages.jsx, 'jsx')}
		tabSize={4}
		on:value-change={onChange}
		--padding="20px"
	/>
</div>
