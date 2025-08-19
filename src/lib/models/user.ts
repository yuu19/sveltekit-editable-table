// src/lib/schemas/user.ts
import { z } from 'zod';

/** Drizzle で使用する RoleName enum */
export enum RoleName {
        ADMIN = 'ADMIN',
        EDITOR = 'EDITOR',
        USER = 'USER'
}

/** RoleName enum をそのまま zod の enum として使う */
export const roleNameSchema = z.nativeEnum(RoleName);

/** ────────────────────────────────────────────────
 * ユーザー作成用スキーマ（input 用）
 * ────────────────────────────────────────────────
 * ・必須項目：email, name
 * ・role は省略可。指定がなければ USER が入る
 */
export const createUserSchema = z.object({
	email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
	name: z.string().min(1, { message: '名前は必須です' }),
	role: roleNameSchema.default(RoleName.USER),
	description: z.string().optional()
});

/** スキーマから生成される型 */
export type CreateUser = z.infer<typeof createUserSchema>;

/** ────────────────────────────────────────────────
 * フルユーザー情報用スキーマ（DB から読む output 用）
 * ────────────────────────────────────────────────
 * createUserSchema に加えて、DB 側で自動生成されるフィールドを定義
 */
export const userSchema = createUserSchema.extend({
	id: z.string(),
	createdAt: z.instanceof(Date),
	updatedAt: z.instanceof(Date)
});

export type User = z.infer<typeof userSchema>;
