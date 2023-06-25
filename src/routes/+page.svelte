<script lang="ts">
	import { Avatar, Button, Heading, Input } from 'flowbite-svelte';
	import { GithubIcon, ArrowRightIcon, PlusCircleIcon, LogInIcon } from 'svelte-feather-icons';
	import type { PageData } from './$types';
	import { goto } from "$app/navigation";
	import { deserialize } from '$app/forms';
	
	export let data: PageData;

	let value = '';
	let creating = false;

	const toggleCreate = () => (creating = !creating);
	
	const onSubmit = async () => {
		let id = "";
		console.log("submitting");
		
		if (creating) {
		console.log("creating");
			const data = new FormData();
			data.set("value", value);
			
			const response = await fetch('?/create', {
				method: 'POST',
				body: data
			});

			const result: ActionResult = deserialize(await response.text());
			console.log("result", result);

			if (result.type === 'success') {
				id = result.data.id;
			}
		} else {
			id = value;
		}
		
		if (id) {
			const location = `/project/${id}`;
			await goto(location);
		}
	}

	$: placeholder = creating ? 'Enter new project name' : 'Enter project ID';
	$: label = creating ? 'Join Project' : 'New Project';
	$: ActionIcon = creating ? LogInIcon : PlusCircleIcon;
	$: formaction = creating ? 'create' : 'join';
</script>

<main class="w-full dark h-full flex flex-col justify-center items-center">
	<header class="text-center mb-5">
		<Heading tag="h1">Code Editor</Heading>
		<Heading tag="h6">Made with Svelte</Heading>
	</header>
	{#if data.session.user}
		{@const user = data.session.user}
		<div
			class="text-gray-800 p-3 rounded-xl border-2 border-white bg-gray-300 flex flex-row items-center space-x-2"
		>
			<Avatar src={user.avatar} rounded />
			<span>{user.username}</span>
		</div>

		<Button on:click={toggleCreate} outline gradient color="greenToBlue" btnClass="mt-6">
			<svelte:component this={ActionIcon} />
			<span class="ml-2">{label}</span>
		</Button>

		<div class="space-y-2 mt-5 flex flex-col">
			<Input type="text" bind:value required {placeholder} size="lg" />
			{#if value.length > 0}
				<Button on:click={onSubmit} gradient class="!p-2" color="tealToLime">
					<ArrowRightIcon />
				</Button>
			{/if}
		</div>
	{:else}
		<Button href="auth" color="light">
			<GithubIcon size="24" />
			<span class="ml-1">Login</span>
		</Button>
	{/if}
</main>

<style lang="postcss">
	:global(body, html) {
		width: 100%;
		height: 100%;
		background: theme(backgroundColor.stone.800);
	}
</style>
