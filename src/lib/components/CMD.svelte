<script context="module" src="node_modules/xterm/lib/xterm.js"></script>

<script lang="ts">
	import { onMount } from 'svelte';
	// import { Terminal } from 'xterm';
	import { Terminal } from 'xterm';

	let term: Terminal;

	let el: HTMLDivElement;

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'node_modules/xterm/lib/xterm.js';
		script.onload = () => {
			term = new Terminal({
				cols: 30
			});
			term.open(el);
		};
		document.head.appendChild(script);
	});

	$: if (term) {
		let line = '';
		term.onKey(({ key }) => {
			if (key.charCodeAt(0) === 13) {
				term.write('\n');
				// Submit linej
				line = '';
			} else {
				term.write(key);
				line += key;
			}
			console.log(key);
		});
	}
</script>

<div bind:this={el} />
