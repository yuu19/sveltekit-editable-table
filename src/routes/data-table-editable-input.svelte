<script lang="ts">
	import SuperDebug from 'sveltekit-superforms';
	import type { Row, Table, Column } from '@tanstack/table-core';
	import type { User } from './schemas.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ComponentProps } from 'svelte';

	const uid = $props.id();
	type Props = {
		getValue: () => any;
		row: Row<User>;
		column: Column<User>;
		table: Table<User>;
	} & Exclude<ComponentProps<typeof Input>, 'value' | 'id' | 'onBlur'>;

	const { getValue, row, column, table, ...restProps }: Props = $props();
	const { index } = row;
	const { id } = column;
	const initialValue = getValue();
	let value = $state(initialValue);
	const onBlur = () => {
		table.options.meta?.updateData(index, id, value);
	};
	$effect(() => {
		value = initialValue;
	});
</script>

<!-- <SuperDebug data={{ row }} /> -->
<label class="sr-only" for="{id}-{uid}">{id}</label>
<Input {...restProps} id="{id}-{uid}" bind:value onblur={onBlur} />

<!-- cell: ({ getValue, row, row: { index }, column: { id }, table }) => {  
    const nameSnippet = createRawSnippet<[string]>((getName) => {  
      // const initialValue = getValue()  
			const initialValue = row.original.name;

        
      // Svelte 5のstateルーンを使用  
      let value = $state(initialValue)  
			// console.log('value', value);
        
      const onBlur = () => {  
        // table.options.meta?.updateData(index, id, value)  
      }  
        
      // // initialValueの変更を監視してvalueを同期  
      // $effect(() => {  
      //   value = initialValue  
      // })  
        
      return {  
        render: () => `  
          <input   
					  type="text"
						name="name"
            bind:value={value}  
            onblur={onBlur}  
          />  
        `  
      }  
    })   -->

<!-- <script lang="ts" module>
  import { z } from "zod";
 
  export const formSchema = z.object({
    username: z.string().min(2).max(50)
  });
  export type FormSchema = typeof formSchema;
</script>
 
<script lang="ts">
  import SuperDebug, {
    type Infer,
    type SuperValidated,
    superForm
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { browser } from "$app/environment";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { page } from "$app/state";
 
  let {
    form: data = page.data.username
  }: { form: SuperValidated<Infer<FormSchema>> } = $props();
 
  const form = superForm(data, {
    validators: zodClient(formSchema),
  });
 
  const { form: formData, enhance } = form;
</script>
 
<form action="/?/username" method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
  {#if browser}
    <SuperDebug data={$formData} />
  {/if}
</form> -->
