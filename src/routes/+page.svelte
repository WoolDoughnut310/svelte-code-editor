<script lang="ts">
	import { Button, Heading, Input } from 'flowbite-svelte';
	import { GithubIcon, ArrowRightIcon, PlusCircleIcon, LogInIcon } from 'svelte-feather-icons';
	import type { PageData } from './$types';

	export let data: PageData;

	let value = '';
	let creating = false;

	const toggleCreate = () => (creating = !creating);

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
			class="text-gray-800 p-3 rounded-xl border-2 border-white bg-gray-300 flex flex-row space-x-2"
		>
			<img alt="Avatar" src={user.avatar} referrerpolicy="no-referrer" class="w-6 h-6" />
			<span>{user.username}</span>
		</div>

		<Button on:click={toggleCreate} outline gradient color="greenToBlue" btnClass="mt-6">
			<svelte:component this={ActionIcon} />
			<span class="ml-2">{label}</span>
		</Button>s

		<form method="POST" action={`?/${formaction}`} class="space-y-2 mt-5 flex flex-col">
			<Input type="text" name="value" bind:value required {placeholder} size="lg" />
			{#if value.length > 0}
				<Button type="submit" gradient class="!p-2" color="tealToLime"><ArrowRightIcon /></Button>
			{/if}
		</form>
	{:else}
		<Button href="auth" color="light">
			<GithubIcon size="24" />
			<span>Login</span>
		</Button>
	{/if}
</main>

<style lang="postcss">
	:global(body, html) {
		width: 100%;
		height: 100%;
		display: flex;
		justify-center: center;
		align-items: center;
		background: theme(backgroundColor.stone.800);
		color: white;
	}
</style>
