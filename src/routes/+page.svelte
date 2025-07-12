<script lang="ts">
	import DataTable from './data-table.svelte';
	import type { User } from './schemas';

	let { data } = $props();
	let users = $derived(data.users);
</script>

<DataTable data={users} />
