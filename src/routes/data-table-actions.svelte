<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	let { id, userName }: { id: string, userName: string } = $props();
</script>

<AlertDialog.Root>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<!-- #chile部分　<FloatingLayerAnchor {id} ref={triggerState.opts.ref}>-->
				<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
					<span class="sr-only">Open menu</span>
					<Ellipsis />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>Actions</DropdownMenu.GroupHeading>
				<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
					ユーザーIDをコピー
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<AlertDialog.Trigger class="text-destructive">
			<DropdownMenu.Item>
				<span>ユーザーを削除</span>
			</DropdownMenu.Item>
			</AlertDialog.Trigger>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>ユーザー{userName}の削除</AlertDialog.Title>
			<AlertDialog.Description>
				<p>このボタンを押すと、ユーザーの削除が確定します。よろしいですか？</p>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>キャンセル</AlertDialog.Cancel>
			<form method="post">
				<input type="hidden" name="id" value={id} />
				<Button
					type="submit"
					formaction="?/delete"
					variant="destructive">削除</Button
				>
			</form>
			<!-- </AlertDialog.Action> -->
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
