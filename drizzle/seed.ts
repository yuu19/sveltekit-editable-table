import { randomUUID } from 'node:crypto';

import { db, users } from '../src/lib/server/db';
import { RoleName } from '../src/lib/models/user';

async function main() {
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
    db.insert(users)
      .values({
        id: randomUUID(),
        email: u.email,
        name: u.name,
        role: u.role,
        description: u.description ?? null
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: u.name,
          role: u.role,
          description: u.description ?? null
        }
      })
      .run();
  }
}

main();
