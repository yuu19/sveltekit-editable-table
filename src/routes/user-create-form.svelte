<script lang="ts">
	import { Plus, Loader2 } from '@lucide/svelte';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input/index';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { createUserSchema, type CreateUser } from '$lib/models/user';
	import { page } from '$app/state';
	import { roleLabel } from '$lib/models/role';

	const form = superForm<CreateUser>(page.data.form, {
		validators: zodClient(createUserSchema),
		clearOnSubmit: 'none'
	});
	const { form: formData, enhance, errors, delayed } = form;

	let selectedRoleLabel = $derived($formData.role ? roleLabel[$formData.role] : 'ロールを選択');
	import SuperDebug from 'sveltekit-superforms';
</script>

<Card>
	<CardHeader>
		<CardTitle>新規ユーザー作成</CardTitle>
	</CardHeader>
	<CardContent>
		<form method="POST" action="?/create" class="space-y-4">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<div class="space-y-2">
					<Label for="name">ユーザー名</Label>
					<Input
						id="name"
						name="name"
						bind:value={$formData.name}
						placeholder="ユーザー名を入力"
						required
						aria-invalid={$errors.name ? 'true' : undefined}
					/>
				</div>

				<div class="space-y-2">
					<Label for="role">ロール</Label>
					<Select.Root type="single" name="role" bind:value={$formData.role} required>
						<Select.Trigger>
							{selectedRoleLabel}
						</Select.Trigger>
						<Select.Content>
							{#each Object.entries(roleLabel) as [value, label]}
								<Select.Item {value}>
									{label}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<div class="space-y-2">
					<Label for="email">メールアドレス</Label>
					<Input
						id="email"
						name="email"
						type="email"
						bind:value={$formData.email}
						placeholder="email@example.com"
						aria-invalid={$errors.email ? 'true' : undefined}
						aria-describedby={$errors.email ? 'email-error' : undefined}
						required
					/>
					{#if $errors.email}<p id="email-error" class="mt-1 text-sm text-red-600">
							{$errors.email}
						</p>{/if}
				</div>

				<div class="flex items-end gap-2">
					<div class="space-y-2">
						<Label for="description">説明</Label>
						<Input
							id="description"
							name="description"
							type="text"
							bind:value={$formData.description}
							placeholder="説明を入力"
							aria-invalid={$errors.description ? 'true' : undefined}
						/>
					</div>
					<Button type="submit" size="icon" class="shrink-0">
						{#if $delayed}
							<Loader2 class="size-4 animate-spin " />
						{:else}
							<Plus class="h-4 w-4" />
						{/if}
					</Button>
				</div>
			</div>
		</form>
	</CardContent>
</Card>
