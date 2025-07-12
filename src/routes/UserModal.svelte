<script lang="ts">
	import { Field, Control, Label, FieldErrors, Description } from 'formsnap';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { createUserSchema, type CreateUser } from '$lib/models/user';
	import { page } from '$app/state';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let { isDialogOpen = $bindable(false) } = $props();
	const createUserForm = superForm<CreateUser>(page.data.createUserForm, {
		validators: zodClient(createUserSchema)
	});

	const { form: formData, enhance } = createUserForm;
</script>

<Dialog.Root bind:open={isDialogOpen}>
	<Dialog.Trigger>
		<Button variant="outline" class="ml-2 bg-transparent">Add user</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>新しいユーザーを追加</Dialog.Title>
		</Dialog.Header>

		<form class="space-y-4">
			<div class="space-y-2">
				<Label>ユーザー名</Label>
				<Input id="name" value={$formData.name} placeholder="Enter user name" />
				<p class="text-sm text-muted-foreground">Be sure to use your real name.</p>
			</div>

			<div class="space-y-2">
				<Label>Email</Label>
				<Input id="email" type="email" value={$formData.email} placeholder="Enter email address" />
				<p class="text-sm text-muted-foreground">Add User</p>
			</div>

			<Dialog.Footer>
				<Button type="submit" onclick={() => (isDialogOpen = false)}>Save changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
<!-- <form method="POST" use:enhance>
	<Field form={createUserForm} name="name">
		<Control>
			{#snippet children({ props })}
				<Label>ユーザー名</Label>
				<input {...props} bind:value={$formData.name} />
			{/snippet}
		</Control>
		<Description>Be sure to use your real name.</Description>
		<FieldErrors />
	</Field>
	<Field form={createUserForm} name="email">
		<Control>
			{#snippet children({ props })}
				<Label>Email</Label>
				<input {...props} type="email" bind:value={$formData.email} />
			{/snippet}
		</Control>
		<Description>Add User</Description>
		<FieldErrors />
	</Field>
</form> -->
