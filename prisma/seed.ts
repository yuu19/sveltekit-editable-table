import { PrismaClient, RoleName } from '@prisma-app/client';

const prisma = new PrismaClient();

async function main() {
	// もしユーザーごとに初期ユーザーを作りたい場合はここで定義
	const initialUsers = [
		{
			email: 'admin@example.com',
			name: 'test-user-1',
			role: RoleName.ADMIN,
			description: '管理者ユーザー'
		},
		{
			email: 'editor@example.com',
			name: 'test-user-2',
			role: RoleName.EDITOR,
			description: '編集者ユーザー'
		},
		{ email: 'user@example.com', name: 'test-user-3', role: RoleName.USER }
	];

	for (const u of initialUsers) {
		await prisma.user.upsert({
			where: { email: u.email },
			update: {
				name: u.name,
				role: u.role,
				description: u.description || null // descriptionがある場合のみ更新
			},
			create: {
				email: u.email,
				name: u.name,
				role: u.role,
				description: u.description || null // descriptionがある場合のみ設定
			}
		});
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
