<script lang="ts">
	import { Tabs, TabItem, Input, Heading } from 'flowbite-svelte';
	import Editor from './Editor.svelte';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';
	import { Types } from 'mongoose';
	import { project } from '$lib/stores';

	export let fileId: Types.ObjectId;

	export let editing: {
		id: Types.ObjectId;
		value: string;
	};

	const renameFile = async () => {
		const data = new FormData();
		data.set('id', editing.id.toString());
		data.set('value', editing.value);

		const response = await fetch('?/renameFile', {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			await invalidateAll();
			editing = {
				id: new Types.ObjectId(),
				value: ''
			};
		}

		applyAction(result);
	};
</script>

<Tabs contentClass="flex-1 overflow-auto text-lg bg-gray-800 text-white rounded-2xl relative">
	{#each $project.files as file (file._id.toString())}
		<TabItem open={file._id.equals(fileId)} on:click={() => (fileId = file._id)} title={file.name}>
			<div slot="title">
				{#if editing.id.equals(file._id)}
					<Input type="text" on:blur={() => renameFile()} name="value" bind:value={editing.value} />
				{:else}
					{file.name}
				{/if}
			</div>
			<Editor {file} />
		</TabItem>
	{:else}
		<TabItem open title="New">
			<div class="flex flex-col space-y-6 justify-center items-center">
				<Heading tag="h3" color="white" class="text-center mt-24">Create a new File</Heading>
				<img src="/favicon.png" alt="Svelte Icon" />
			</div>
		</TabItem>
	{/each}
</Tabs>
