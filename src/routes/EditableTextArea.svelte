<script lang="ts">
	import { tick } from 'svelte';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { Row, Table, Column } from '@tanstack/table-core';
	import { Check, X, Edit } from '@lucide/svelte';
	import type { User } from './schemas.js';

	type Props = {
		getValue: () => any;
		row: Row<User>;
		column: Column<User>;
		table: Table<User>;
	};

	const { getValue, row, column, table }: Props = $props();
	const { index } = row;
	const { id } = column;
	const initialValue = $state(getValue() ?? ('' as string));

	let value = $state(initialValue);
	let editing = $state(false);

	function toggleDescriptionEdit() {
		editing = !editing;
		if (editing) {
			// 編集モードに入ったら、textareaにフォーカスを当てる
			tick().then(() => {
				if (textareaEl) {
					textareaEl.focus();
				}
			});
		}
	}

	// 外部から初期値が変わったら同期
	$effect(() => {
		value = initialValue;
	});
	let textareaEl: HTMLTextAreaElement | null = $state(null);

	function saveDescription() {
		table.options.meta?.updateData(index, id, value);
		editing = false;
	}

	function cancelDescriptionEdit() {
		editing = false;
		value = initialValue; // 元の値に戻す
	}
</script>

{#if editing}
	<div class="space-y-2">
		<Textarea
			bind:ref={textareaEl}
			bind:value
			class="min-h-[80px] resize-none"
			onkeydown={(e: KeyboardEvent) => {
				if (e.key === 'Enter' && e.ctrlKey) saveDescription();
				if (e.key === 'Escape') cancelDescriptionEdit();
			}}
			onblur={(event: FocusEvent) => {
				const to = event.relatedTarget as HTMLElement | null;
				// ボタン要素にフォーカスが移ったらキャンセルしない
				if (to && (to.closest('.save-btn') || to.closest('.cancel-btn'))) {
					return;
				}
				cancelDescriptionEdit();
			}}
		/>
		<div class="flex gap-2">
			<Button
				size="sm"
				class="save-btn bg-green-500 p-2 text-white hover:bg-green-600"
				onclick={() => saveDescription()}
			>
				<Check class="h-4 w-4" />
			</Button>
			<Button
				size="sm"
				variant="outline"
				class="cancel-btn bg-gray-400 p-2 text-white hover:bg-gray-500"
				onclick={() => cancelDescriptionEdit()}
			>
				<X class="h-4 w-4" />
			</Button>
		</div>
	</div>
{:else if value == ''}
	<button
		class="mt-1 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
		ondblclick={() => toggleDescriptionEdit()}
	>
		<Edit class="h-3 w-3" />
		edit
	</button>
{:else}
	<button type="button" class="flex items-center gap-2" ondblclick={() => toggleDescriptionEdit()}>
		<span class="text-sm text-gray-700">{value}</span>
	</button>
{/if}
