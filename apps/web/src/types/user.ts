import { z } from 'zod';

import { User as UserSchema } from '@/schemas/user';

export type User = z.infer<typeof UserSchema>;
