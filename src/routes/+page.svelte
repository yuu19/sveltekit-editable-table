<script lang="ts">
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';
	import type { Payment } from './columns';

	let { data } = $props();
	const payments: Payment[] = $derived(data.payments);
</script>

<DataTable data={payments} {columns} />
