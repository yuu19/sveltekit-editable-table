import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma-app/client';

const prisma = new PrismaClient();
export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = params.id;
	const updates = await request.json();
	try {
		const updated = await prisma.user.update({
			where: { id },
			data: updates
		});
		return new Response(JSON.stringify(updated), { status: 200 });
	} catch (error) {
		console.error('Prisma update error:', error);
		return new Response('Failed to update', { status: 500 });
	}
};
