<script lang="ts" module>
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
</form>