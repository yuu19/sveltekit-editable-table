import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import { renderSnippet } from '$lib/components/ui/data-table/index.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from './data-table-actions.svelte';
import DataTableCheckbox from './data-table-checkbox.svelte';
import DataTableEmailButton from './data-table-email-button.svelte';

export type Payment = {
	id: string;
	task: string;
	targetPomodoroCount: number;
	currentPomodoroCount: number;
	status: 'pending' | 'processing' | 'success' | 'failed';
	email: string;
};

export const columns: ColumnDef<Payment>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		// getter setterパターンの例 https://svelte.dev/playground/hello-world?version=5.9.0#H4sIAAAAAAAACm1QTUvEMBT8K4-H0F0o7T3bVBYRPOnBkxgPbfN2DcY0NK-6UvLfJf1QBE8TZt4MM5nQNe-EAu_I2h4--8Fq2JE2THqPOZ6MpYDieUL-8ukuEZhvrqP3Rfggy4lrm0D_8V3vmBwHFKhcFbrBeK6VU2yJ4WSbM0i4Ctww7bL7h2x_UG5Tu1fq3kiDhClRis_EAnZ7kPXGKB6Ix8GtSRKyp9vH7LCIMV8QIMxGE26WxL8Ja4kfFa6XFBCQGq1ZCeJcrip_VzjFlXF-ZEg_JBXOndv-ohCMlgqNVgitcVqsa-S0Poozcb5tLAJxhHKOrGzTkoVTP6z-GhamKmdcjnw9peKxKn2tHObIdGEUPIwUX-I3swQelNoBAAA=
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'task',
		header: 'タスク名',
		cell: ({ row }) => {
			const taskSnippet = createRawSnippet<[string]>((getTask) => {
				const task = getTask();
				return {
					render: () => `<div class="capitalize">${task}</div>`
				};
			});
			return renderSnippet(taskSnippet, row.getValue('task'));
		}
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const statusSnippet = createRawSnippet<[string]>((getStatus) => {
				const status = getStatus();
				return {
					render: () => `<div class="capitalize">${status}</div>`
				};
			});
			return renderSnippet(statusSnippet, row.getValue('status'));
		}
	},
	{
		accessorKey: 'email',
		header: ({ column }) =>
			renderComponent(DataTableEmailButton, {
				onclick: column.getToggleSortingHandler()
			}),
		cell: ({ row }) => {
			const emailSnippet = createRawSnippet<[string]>((getEmail) => {
				const email = getEmail();
				return {
					render: () => `<div class="lowercase">${email}</div>`
				};
			});

			return renderSnippet(emailSnippet, row.getValue('email'));
		}
	},
	{
		accessorKey: 'currentPomodoroCount',
		header: () => {
			const currentPomodoroCountHeaderSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="text-right">現在のポモドーロ数</div>`
				};
			});
			return renderSnippet(currentPomodoroCountHeaderSnippet, '');
		},
		cell: ({ row }) => {
			const currentPomodoroCountCellSnippet = createRawSnippet<[string]>((getCurrentPomodoroCount) => {
				const currentPomodoroCount = getCurrentPomodoroCount();
				return {
					render: () => `<div class="text-right font-medium">${currentPomodoroCount}</div>`
				};
			});

			return renderSnippet(
				currentPomodoroCountCellSnippet,
				row.getValue('currentPomodoroCount')
			);
		}
	},
	{
		accessorKey: 'targetPomodoroCount',
		header: () => {
			const targetPomodoroCountHeaderSnippet = createRawSnippet(() => {
				return {
					render: () => `<div class="text-right">目標ポモドーロ数</div>`
				};
			});
			return renderSnippet(targetPomodoroCountHeaderSnippet, '');
		},
		cell: ({ row }) => {
			const targetPomodoroCountCellSnippet = createRawSnippet<[string]>((getTargetPomodoroCount) => {
				const targetPomodoroCount = getTargetPomodoroCount();
				return {
					render: () => `<div class="text-right font-medium">${targetPomodoroCount}</div>`
				};
			});

			return renderSnippet(
				targetPomodoroCountCellSnippet,
				row.getValue('targetPomodoroCount')
			);
		}
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id })
	}
];
