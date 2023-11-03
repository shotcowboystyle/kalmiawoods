import { z } from 'zod';
import { AuthUserSchema } from './auth';
import { UserProfileWithoutIdSchema } from './user';

const BUILDING_VALUES = ['HOUSE', 'GARAGE', 'WORKSHOP'] as const;
export const BuildingEnum = z.enum(BUILDING_VALUES);

export const ReservationSchema = z.object({
	reservationId: z.string(),
	title: z.string().optional(),
	checkInDate: z.date(),
	checkOutDate: z.date(),
	buildings: z.array(BuildingEnum).max(3),
	userId: z.string(),
	user: UserProfileWithoutIdSchema.merge(AuthUserSchema.pick({ email: true })),
});

export const Reservations = ReservationSchema.array();
