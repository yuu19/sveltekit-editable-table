import type { Actions, PageServerLoad } from './$types.js';
import { setError, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { asc, eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { createUserSchema } from '$lib/models/user';
import { db, users as usersTable } from '$lib/server/db';
export async function load() {
	// const form = await superValidate(zod(formSchema));
	// (superformsではnativeEnumについて最初の値をデフォルトとして使用するがあとでクライアント側でrow.originalを使用して上書き
	// 参考: https://github.com/ciscoheat/sveltekit-superforms/blob/90356fcf/src/tests/superValidate.test.ts#L674

	const form = await superValidate(zod(createUserSchema));

        const userList = await db
                .select({
                        id: usersTable.id,
                        name: usersTable.name,
                        role: usersTable.role,
                        email: usersTable.email,
                        description: usersTable.description
                })
                .from(usersTable)
                .orderBy(asc(usersTable.position))
                .all();
        return {
                users: userList,
                form
        };
}

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const form = await superValidate(formData, zod(createUserSchema));
		if (!form.valid) return fail(400, { form });

                const exists = await db
                        .select()
                        .from(usersTable)
                        .where(eq(usersTable.email, form.data.email))
                        .get();
                if (exists) {
                        console.log('email already exists');
                        return setError(form, 'email', 'メールアドレスは既に登録されています');
                }

                db.insert(usersTable)
                        .values({
                                id: randomUUID(),
                                email: form.data.email,
                                name: form.data.name,
                                role: form.data.role,
                                description: form.data.description ?? null
                        })
                        .run();

		return message(form, 'role updated successfully!');
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'ID is required' });
		}

		try {
                        db.delete(usersTable).where(eq(usersTable.id, id)).run();
			return message({ success: true }, 'User deleted successfully');
		} catch (error) {
			console.error('Error deleting user:', error);
			return fail(500, { message: 'Failed to delete user' });
		}
	}
};
