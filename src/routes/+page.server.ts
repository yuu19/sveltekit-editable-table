import type { Actions, PageServerLoad } from './$types.js';
import { setError, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { Prisma, PrismaClient } from '@prisma-app/client';
import { createUserSchema } from '$lib/models/user';

const prisma = new PrismaClient();
export async function load() {
	// const form = await superValidate(zod(formSchema));
	// (superformsではnativeEnumについて最初の値をデフォルトとして使用するがあとでクライアント側でrow.originalを使用して上書き
	// 参考: https://github.com/ciscoheat/sveltekit-superforms/blob/90356fcf/src/tests/superValidate.test.ts#L674

	const form = await superValidate(zod(createUserSchema));

	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true, // Nullable な場合は string | null になります
			role: true,
			email: true,
			description: true
		},
		orderBy: { position: 'asc' }
	});
	return {
		users,
		form
	};
}

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(createUserSchema));
		if (!form.valid) return fail(400, { form });

		if (
			await prisma.user.findFirst({
				where: {
					email: form.data.email
				}
			})
		) {
			console.log('email already exists');
			return setError(form, 'email', 'メールアドレスは既に登録されています');
		}

		await prisma.user.create({
			data: form.data
		});

		return message(form, 'role updated successfully!');
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'ID is required' });
		}

		try {
			await prisma.user.delete({
				where: { id }
			});
			return message({ success: true }, 'User deleted successfully');
		} catch (error) {
			console.error('Error deleting user:', error);
			return fail(500, { message: 'Failed to delete user' });
		}
	}
};
