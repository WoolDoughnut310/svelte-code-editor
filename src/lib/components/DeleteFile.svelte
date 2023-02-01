<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import type { Types } from 'mongoose';
	import { TrashIcon } from 'svelte-feather-icons';

	export let fileId: Types.ObjectId;
</script>

<form method="POST" action="?/deleteFile" class="inline">
	<Button type="submit" title="Delete file" shadow="pink" color="red" pill>
		<TrashIcon />
	</Button>
	<input type="text" hidden name="id" value={fileId.toString()} />
</form>
