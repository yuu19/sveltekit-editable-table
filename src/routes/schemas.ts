import { z } from 'zod';

export const RoleNameSchema = z.enum(['ADMIN', 'EDITOR', 'USER']);
export type RoleName = z.infer<typeof RoleNameSchema>;

export const RoleFormSchema = z.object({
	id: z.string(),
	role: RoleNameSchema
});
export type RoleForm = z.infer<typeof RoleFormSchema>;

// Payment スキーマ
export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	role: RoleNameSchema,
	email: z.string().email(),
	description: z.string().optional()
});

// TypeScript の型としても再利用可能
export type User = z.infer<typeof UserSchema>;
