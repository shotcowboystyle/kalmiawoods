import { z } from 'zod';

import { AuthUserSchema } from './auth';
import { UserProfileWithoutIdSchema } from './user';

// const BUILDING_VALUES = ['HOUSE', 'WORKSHOP'] as const;
export const BuildingEnum = z.enum(['HOUSE', 'WORKSHOP']);

export const ReservationSchema = z.object({
  id: z.string(),
  checkInDate: z.date(),
  checkOutDate: z.date(),
  buildings: z.array(BuildingEnum).max(2),
  userId: z.string(),
  user: UserProfileWithoutIdSchema.merge(AuthUserSchema.pick({ email: true })),
});

export const Reservations = ReservationSchema.array();
