import { z } from 'zod';

import { AuthUserNoIdSchema, AuthUserSchema } from '@/schemas/auth';

export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthUserNoId = z.infer<typeof AuthUserNoIdSchema>;
