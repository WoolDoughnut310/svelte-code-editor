<script lang="ts">
	import { setContext } from 'svelte';
	import type { PageData } from './$types';

	import { Types } from 'mongoose';
	import io from 'socket.io-client';

	import FileTabs from '$lib/components/FileTabs.svelte';
	import RenameFile from '$lib/components/RenameFile.svelte';
	import DeleteFile from '$lib/components/DeleteFile.svelte';
	import CreateFile from '$lib/components/CreateFile.svelte';
	import UsersList from '$lib/components/UsersList.svelte';
	import { project } from '$lib/stores';

	export let data: PageData;

	const socket = io({
		auth: {
			projectId: $project._id.toString(),
			user: data.session.user
		}
	});

	setContext('socket', socket);

	// Currently opened file
	let fileId = $project.files[0]?._id ?? new Types.ObjectId();

	// Used to access the file's other properties
	$: file = $project.files.find((file) => file._id.equals(fileId));

	// id (id of file to rename), value (new value)
	let editing = {
		id: new Types.ObjectId(),
		value: ''
	};
</script>

<main class="w-full h-full flex flex-col justify-center items-center">
	<div class="w-5/6 flex flex-row justify-around mb-10">
		<div>
			<RenameFile on:click={() => (editing = { id: fileId, value: file?.name ?? '' })} />
			<DeleteFile {fileId} />
		</div>
		<UsersList />
		<CreateFile />
	</div>
	<div class="w-5/6 h-3/4 relative">
		<FileTabs {editing} {fileId} />
	</div>
</main>

<style global>
	:global(html, body) {
		width: 100%;
		height: 100%;
	}
</style>
