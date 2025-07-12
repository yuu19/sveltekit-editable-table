import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma-app/client';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	const { order } = (await request.json()) as { order: string[] };

	// 例: items テーブルに「position」という数値カラムがある前提
	// 新しい並び順に従って、position を 0 から順に振り直す
	await prisma.$transaction(
		order.map((id, index) =>
			prisma.user.update({
				where: { id },
				data: { position: index }
			})
		)
	);

	return new Response(null, { status: 204 });
};
