<script lang="ts">
	import type { PageData } from './$types';
	import io from 'socket.io-client';
	import { setContext } from 'svelte';
	import Editor from '$lib/components/Editor.svelte';
	import { EJSON } from 'bson';
	import FileTabs from '$lib/components/FileTabs.svelte';

	export let data: PageData;

	const project = EJSON.deserialize(data.project) as PageData['project'];
	console.log('project', project);

	const socket = io({
		auth: {
			projectId: project._id.toString(),
			user: data.session.user
		}
	});

	setContext('socket', socket);
	setContext('project', project);
</script>

<main class="w-full h-full flex flex-col justify-center items-center">
	<FileTabs />
</main>

<style global>
	:global(html, body) {
		width: 100%;
		height: 100%;
	}
</style>
