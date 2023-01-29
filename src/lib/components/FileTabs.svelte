<script lang="ts">
	import { page } from '$app/stores';
	import { Tabs, TabItem, Button, Popover, Input } from 'flowbite-svelte';
	import { EJSON } from 'bson';
	import Editor from './Editor.svelte';
	import { EditIcon, PlusCircleIcon, TrashIcon } from 'svelte-feather-icons';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { LeanProjectDocument } from '$lib/server/models/Project';

	let project = EJSON.deserialize($page.data.project) as LeanProjectDocument;

	let filename = '';

	let editing = {
		old: '',
		new: ''
	};

	page.subscribe(() => {
		project = EJSON.deserialize($page.data.project) as LeanProjectDocument;
	});
</script>

<div class="w-5/6 h-3/4 relative">
	<Tabs contentClass="h-full overflow-auto text-lg bg-gray-800 text-white rounded-2xl relative">
		{#each project.files as file (file._id.toString())}
			<TabItem
				open={file.name === filename}
				on:click={() => (filename = file.name)}
				title={file.name}
			>
				<div slot="title">
					{#if editing.old === file.name}
						<form
							use:enhance
							method="POST"
							action="?/renameFile"
							on:submit={() => {
								editing = { old: '', new: '' };
								invalidateAll();
							}}
						>
							<input type="text" hidden name="id" value={file._id.toString()} />
							<Input type="text" name="value" bind:value={editing.new} />
						</form>
					{:else}
						{file.name}
					{/if}
				</div>
				<Editor filename={file.name} />
			</TabItem>
		{/each}
	</Tabs>
	<div class="absolute -top-14 w-full flex flex-row justify-between z-10">
		<div>
			{@debug filename}
			<Button
				on:click={() => {
					editing = { old: filename, new: filename };
					editing = editing;
				}}
				title="Rename file"
				color="yellow"
				pill><EditIcon /></Button
			>
			<form method="POST" action="?/deleteFile" class="inline">
				<Button type="submit" title="Delete file" shadow="pink" color="red" pill
					><TrashIcon /></Button
				>
				<input type="text" hidden name="filename" value={filename} />
			</form>
		</div>
		<Button id="create-file" title="Create file" shadow="lime" color="light" pill
			><PlusCircleIcon /></Button
		>
		<Popover triggeredBy="#create-file" placement="bottom" class="w-48 h-16" trigger="click">
			<form
				on:submit={() => {
					// Update files list
					invalidateAll();
				}}
				method="POST"
				use:enhance
				action="?/createFile"
			>
				<Input type="text" name="filename" placeholder="Name" />
			</form>
		</Popover>
	</div>
</div>
