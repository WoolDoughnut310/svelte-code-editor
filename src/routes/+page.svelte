<script lang="ts">
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

<main class="w-full h-full flex flex-col justify-center items-center">
	<header class="text-center mb-5">
		<h1 class="text-6xl font-bold">Code Editor</h1>
		<h3 class="text-2xl">Made with Svelte</h3>
	</header>
	{#if data.session.user}
		{@const user = data.session.user}
		<div
			class="text-gray-800 p-3 rounded-xl border-2 border-white bg-gray-300 flex flex-row space-x-2"
		>
			<img alt="Avatar" src={user.avatar} referrerpolicy="no-referrer" class="w-6 h-6" />
			<span>{user.username}</span>
		</div>

		<button
			type="button"
			on:click={toggleCreate}
			class={`mt-6 px-4 py-3 flex flex-row space-x-2 rounded-2xl border-white ${
				creating ? 'bg-sky-400 hover:bg-sky-300' : 'bg-slate-400 hover:bg-slate-300'
			}`}
		>
			<svelte:component this={ActionIcon} />
			<span>{label}</span></button
		>

		<form method="POST" class="space-y-2 mt-5 flex flex-col">
			<input
				type="text"
				bind:value
				name="value"
				{placeholder}
				class="outline-none w-60 p-4 rounded-lg shadow-lg text-gray-800"
			/>
			{#if value.length > 0}
				<button
					formaction={`?/${formaction}`}
					class="py-2 flex flex-row justify-center text-center rounded-2xl bg-slate-600 hover:bg-slate-500 border-sky-400"
					><ArrowRightIcon /></button
				>
			{/if}
		</form>
	{:else}
		<a
			href="/auth"
			class="p-3 rounded-xl border-white bg-gray-300 hover:bg-gray-400 flex flex-row space-x-2"
		>
			<GithubIcon size="24" />
			<span>Login</span>
		</a>
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
