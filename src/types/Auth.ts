import { AuthUserNoIdSchema, AuthUserSchema, RoleEnum } from '@/schemas/auth';
import { z } from 'zod';

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthUserNoId = z.infer<typeof AuthUserNoIdSchema>;
export type RoleEnum = z.infer<typeof RoleEnum>;
