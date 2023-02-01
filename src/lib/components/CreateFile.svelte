<script lang="ts">
	import { Button, Popover, Input } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { PlusCircleIcon } from 'svelte-feather-icons';
</script>

<Button id="create-file" title="Create file" shadow="cyan" pill><PlusCircleIcon /></Button>
<Popover triggeredBy="#create-file" placement="bottom" class="w-48 h-16" trigger="click">
	<form method="POST" use:enhance action="?/createFile">
		<Input type="text" name="filename" placeholder="Name" />
	</form>
</Popover>
