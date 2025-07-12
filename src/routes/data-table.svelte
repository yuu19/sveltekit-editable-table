<script lang="ts" generics="TData">
	import SuperDebug from 'sveltekit-superforms';

	import { GripVertical } from '@lucide/svelte';
	import { CSS } from '@dnd-kit-svelte/utilities';
	import { renderSnippet } from '$lib/components/ui/data-table/index.js';
	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import DataTableEmailButton from './data-table-email-button.svelte';
	import DataTableRole from './data-table-role.svelte';
	import EditableInput from './data-table-editable-input.svelte';
	import EditableTextArea from './EditableTextArea.svelte';

	import UserCreateForm from './user-create-form.svelte';

	let isAccordionOpen = $state(false);

	export const columns: ColumnDef<User>[] = [
		{
			id: 'drag',
			header: () => null,
			cell: ({ row }) => renderSnippet(DragHandle, { id: row.original.id })
		},
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
			accessorKey: 'name',
			header: 'ユーザー名',
			cell: ({ getValue, row, column, table }) =>
				renderComponent(EditableInput, { getValue, row, column, table })
		},

		{
			accessorKey: 'role',
			header: 'ロール',
			cell: ({ getValue, row, column, table }) =>
				renderComponent(DataTableRole, { getValue, row, column, table })
		},
		{
			accessorKey: 'email',
			header: ({ column }) =>
				renderComponent(DataTableEmailButton, {
					onclick: column.getToggleSortingHandler()
				}),
			cell: ({ getValue, row, column, table }) =>
				renderComponent(EditableInput, { getValue, row, column, table, type: 'email' })
		},
		{
			accessorKey: 'description',
			header: '説明',
			cell: ({ getValue, row, column, table }) =>
				renderComponent(EditableTextArea, { getValue, row, column, table })
		},
		{
			id: 'actions',
			enableHiding: false,
			cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id, userName: row.original.name })
		}
	];

	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		type VisibilityState,
		type ColumnFiltersState,
		type Row,
		type RowSelectionState,
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';

	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index';
	import * as Table from '$lib/components/ui/table/index';

	let isDialogOpen = $state(false);

	// type DataTableProps<TData> = {
	// 	// columns: ColumnDef<TData, TValue>[];
	// 	data: User[];
	// };

	// let { data, columns }: DataTableProps<TData, TValue> = $props();
	import type { User } from '$lib/models/user';
	let { data }: { data: User[] } = $props();

	const sortableId = $props.id();

	const sensors = useSensors(
		useSensor(MouseSensor, {}),
		useSensor(TouchSensor, {}),
		useSensor(KeyboardSensor, {})
	);

	const dataIds: UniqueIdentifier[] = $derived(data.map((item) => item.id));

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let rowSelection = $state<RowSelectionState>({});
	const table = createSvelteTable({
		get data() {
			return data;
		},
		meta: {
			options: [
				{ value: 'USER', label: '一般ユーザー' },
				{ value: 'ADMIN', label: '管理者' },
				{ value: 'EDITOR', label: '編集者' }
			],
			updateData: async (rowIndex: number, columnId: string, value: unknown) => {
				// ページインデックスの自動リセットを次レンダーまでスキップ
				table._autoResetPageIndex();

				const record = data[rowIndex];
				//userのidを取得
				const id = record.id;
				try {
					const res = await fetch(`/api/users/${id}`, {
						method: 'PATCH',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ [columnId]: value }) //Computed Property Names
					});
					if (!res.ok) throw new Error(`HTTP ${res.status}`);
				} catch (err) {
					console.error('DB更新に失敗しました', err);
					// 必要ならロールバックやエラーメッセージ表示をここで
				}

				// signal に新しい配列を代入して再描画をトリガー
				data = data.map((row, idx) =>
					idx === rowIndex ? { ...row, [columnId]: value as any } : row
				);
			}
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: getFilteredRowModel(),

		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},

		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});

	import {
		useSensors,
		MouseSensor,
		TouchSensor,
		KeyboardSensor,
		useSensor,
		type DragEndEvent,
		type UniqueIdentifier,
		DndContext,
		closestCenter
	} from '@dnd-kit-svelte/core';

	import {
		arrayMove,
		SortableContext,
		useSortable,
		verticalListSortingStrategy
	} from '@dnd-kit-svelte/sortable';
	import { restrictToVerticalAxis } from '@dnd-kit-svelte/modifiers';

	async function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = dataIds.indexOf(active.id);
			const newIndex = dataIds.indexOf(over.id);
			data = arrayMove(data, oldIndex, newIndex);
			await fetch('/api/users/reorder', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ order: dataIds })
			});
		}
	}
</script>

<SuperDebug {data} />

<div class="container mx-auto space-y-6 p-6">
	<UserCreateForm />
	<div>
		<div class="flex items-center py-4">
			<Input
				placeholder="Filter emails..."
				value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
				onchange={(e) => {
					table.getColumn('email')?.setFilterValue(e.currentTarget.value);
				}}
				oninput={(e) => {
					table.getColumn('email')?.setFilterValue(e.currentTarget.value);
				}}
				class="max-w-sm"
			/>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Button variant="outline" class="ml-auto bg-transparent">Columns</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
						>
							{column.id}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
		<div class="overflow-hidden rounded-lg border">
			<DndContext
				collisionDetection={closestCenter}
				modifiers={[restrictToVerticalAxis]}
				onDragEnd={handleDragEnd}
				{sensors}
				id={sortableId}
			>
				<Table.Root>
					<Table.Header>
						{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
							<Table.Row>
								{#each headerGroup.headers as header (header.id)}
									<Table.Head>
										{#if !header.isPlaceholder}
											<FlexRender
												content={header.column.columnDef.header}
												context={header.getContext()}
											/>
										{/if}
									</Table.Head>
								{/each}
							</Table.Row>
						{/each}
					</Table.Header>
					<Table.Body>
						{#if table.getRowModel().rows?.length}
							<SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
								{#each table.getRowModel().rows as row (row.id)}
									{@render DraggableRow({ row })}
								{/each}
							</SortableContext>
							<!-- {#each table.getRowModel().rows as row (row.id)}
					<Table.Row data-state={row.getIsSelected() && 'selected'}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row> -->
						{:else}
							<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
							<!-- {/each} -->
						{/if}
					</Table.Body>
				</Table.Root>
			</DndContext>
		</div>
		<div class="flex items-center justify-end space-x-2 py-4">
			<div class="flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div>
			<div class="space-x-2">
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Previous
				</Button>
				<Button
					variant="outline"
					size="sm"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Next
				</Button>
			</div>
		</div>
	</div>

	<!-- <Accordion.Root type="single" class="w-full sm:max-w-[50%]" value="debug">
	<Accordion.Item value="debug" open={isAccordionOpen}>
		<Accordion.Trigger>テーブルデータの確認</Accordion.Trigger>
		<Accordion.Content>
			<SuperDebug {errors} />
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root> -->
</div>

{#snippet DraggableRow({ row }: { row: Row<User> })}
	{@const { transform, transition, node, isDragging } = useSortable({
		id: () => row.original.id
	})}

	<Table.Row
		data-state={row.getIsSelected() && 'selected'}
		data-dragging={isDragging.current}
		bind:ref={node.current}
		class="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
		style="transition: {transition.current}; transform: {CSS.Transform.toString(transform.current)}"
	>
		{#each row.getVisibleCells() as cell (cell.id)}
			<Table.Cell>
				<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
			</Table.Cell>
		{/each}
	</Table.Row>
{/snippet}

<!-- D&D用ボタン-->
{#snippet DragHandle({ id }: { id: number })}
	{@const { attributes, listeners } = useSortable({ id: () => id })}

	<Button
		{...attributes.current}
		{...listeners.current}
		variant="ghost"
		size="icon"
		class="size-7 text-muted-foreground hover:bg-transparent"
	>
		<GripVertical class="size-3 text-muted-foreground" />
		<span class="sr-only">Drag to reorder</span>
	</Button>
{/snippet}
