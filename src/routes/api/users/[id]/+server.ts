import type { RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db, users as usersTable } from '$lib/server/db';
export const PATCH: RequestHandler = async ({ params, request }) => {
        const id = params.id;
        const updates = await request.json();
        try {
                db.update(usersTable).set(updates).where(eq(usersTable.id, id)).run();
                const updated = db
                        .select()
                        .from(usersTable)
                        .where(eq(usersTable.id, id))
                        .get();
                return new Response(JSON.stringify(updated), { status: 200 });
        } catch (error) {
                console.error('Drizzle update error:', error);
                return new Response('Failed to update', { status: 500 });
        }
};
