import z from 'zod';

export const BooleanAsString = z.literal('true').or(z.literal('false'));
