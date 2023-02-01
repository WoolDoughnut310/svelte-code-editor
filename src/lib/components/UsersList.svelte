<script lang="ts">
	import type { User } from '$lib/server/models';
	import type { Client } from '$lib/server/socket/types';
	import { Avatar, Tooltip } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';

	const socket = getContext<Client>('socket');

	let users: User[] = [];

	onMount(() => {
		socket.on('users', (data) => (users = data));
		socket.on('join', (user) => (users = [...users, user]));
		socket.on('leave', (username) => (users = users.filter((user) => user.username !== username)));
	});
</script>

<div class="flex flex-row px-4 py-2 max-w-3xl space-x-3">
	{#each users as user (user.username)}
		<Avatar src={user.avatar} data-name={user.username} rounded border />
	{/each}

	{#if users.length > 0}
		<Tooltip triggeredBy="[data-name]" on:show={(e) => (name = e.target.dataset.name)}>
			{name}
		</Tooltip>
	{/if}
</div>
