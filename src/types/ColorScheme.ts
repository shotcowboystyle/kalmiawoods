import { ColorSchemeSchema } from '@/schemas/colorScheme';
import { z } from 'zod';

export type ColorScheme = z.infer<typeof ColorSchemeSchema>;
