import z from 'zod';

export const ColorSchemeSchema = z.enum(['light', 'dark']);

// export const ColorSchemeSchema = z
// 	.literal('light')
// 	.or(z.literal('dark'))
// 	// .or(z.literal('system'))
// 	.optional();
