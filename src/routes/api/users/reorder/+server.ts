import type { RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db, users as usersTable } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
        const { order } = (await request.json()) as { order: string[] };

        db.transaction((tx) => {
                order.forEach((id, index) => {
                        tx.update(usersTable)
                                .set({ position: index })
                                .where(eq(usersTable.id, id))
                                .run();
                });
        });

        return new Response(null, { status: 204 });
};
