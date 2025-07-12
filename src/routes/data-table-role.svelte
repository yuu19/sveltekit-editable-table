<script lang="ts">
	import SuperDebug from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { Row, Table, Column } from '@tanstack/table-core';
	import type { User } from './schemas.js';
	import type { ComponentProps } from 'svelte';

	const uid = $props.id();
	type Props = {
		getValue: () => any;
		row: Row<User>;
		column: Column<User>;
		table: Table<User>;
	};

	const { getValue, row, column, table }: Props = $props();
	const { index } = row;
	const { id } = column;
	const initialValue = getValue();
	let value = $state(initialValue);
	const onValueChange = () => {
		table.options.meta?.updateData(index, id, value);
	};

	// 選択肢は columnDef.meta.options に置いておく
	// 例: [{ value: 'USER', label: 'ユーザー' }, { value: 'ADMIN', label: '管理者' }]
	const options = table.options.meta?.options as {
		value: string;
		label: string;
	}[];

	// 外部から初期値が変わったら同期
	$effect(() => {
		value = initialValue;
	});
</script>

<Label class="sr-only">Role</Label>
<Select.Root type="single" name="role" bind:value {onValueChange}>
	<Select.Trigger>
		{value ? options.find((opt) => opt.value === value)?.label : 'ロールを選択'}
	</Select.Trigger>
	<Select.Content>
		{#each options as opt (opt.label)}
			<Select.Item value={opt.value}>
				{opt.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>

<!-- <script lang="ts">
  import SuperDebug from "sveltekit-superforms";
  import { toast } from "svelte-sonner";
   import { Input } from "$lib/components/ui/input/index.js";
  import type { Row } from "@tanstack/table-core";
	import type { User } from "./schemas.js";
	// let { row }: { row: Row<Payment> } = $props();
	import { superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Field, Control, Label, FieldErrors, Description } from "formsnap";
	import { RoleFormSchema, roleLable, type RoleForm } from "./schemas.js";
  import { page } from '$app/state';
  
  let { row }: { row: Row<User> } = $props();


  	const form = superForm<RoleForm>(page.data.form, {
		validators: zodClient(RoleFormSchema),
    onChange(event) {  
			// roleフィールドが変更されたときに自動送信  
			if (event.paths.includes('role')) {  
				form.submit();  
			}  
		}  
	});
	const { form: formData, enhance, submit, errors } = form;

	// フォーム初期化後に値を上書き  
	$formData.role = row.original.role;  
  $formData.id = row.original.id;


	let selectedRoleLabel = $derived(
		$formData.role ? roleLable[$formData.role] : "ロールを選択"
	);

  // let formEl: HTMLFormElement;
</script>


<SuperDebug data={{$formData, $errors}} />
<form method="POST" use:enhance>
<form method="POST" use:enhance> 
  <Field {form} name="id">
     <Input type="hidden" name="id" value={$formData.id} />
  </Field>
 
	<Field {form} name="role">
		<Control>
			{#snippet children({ props })}
				<Label class="sr-only">Role</Label>
        <Select.Root type="single" bind:value={$formData.role} name={props.name} >
				 <Select.Root type="single" bind:value={$formData.status} name={props.name} onValueChange={() => submit()} > -->
<!-- <Select.Trigger {...props}>
						{selectedRoleLabel}
					</Select.Trigger>
					<Select.Content>
						{#each Object.entries(roleLable) as [value, label]}
							<Select.Item {value}>
								{label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/snippet}
		</Control>
	</Field>
</form>  -->
